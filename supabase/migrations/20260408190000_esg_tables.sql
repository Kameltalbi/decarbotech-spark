-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT,
  size TEXT, -- 'micro', 'pme', 'eti', 'ge'
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Link profiles to organizations
ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);

-- Organization members can view their org
CREATE POLICY "Members can view their organization"
ON public.organizations FOR SELECT
USING (
  id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Creator can update
CREATE POLICY "Members can update their organization"
ON public.organizations FOR UPDATE
USING (
  id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Anyone authenticated can create an org
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- ESG data: one row per category per org per period
CREATE TABLE public.esg_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL CHECK (pillar IN ('E', 'S', 'G')),
  category TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT to_char(now(), 'YYYY'),
  data JSONB NOT NULL DEFAULT '{}',
  score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (organization_id, pillar, category, period)
);

ALTER TABLE public.esg_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their org esg_data"
ON public.esg_data FOR SELECT
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Members can insert esg_data"
ON public.esg_data FOR INSERT
WITH CHECK (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Members can update esg_data"
ON public.esg_data FOR UPDATE
USING (
  organization_id IN (SELECT organization_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Assessments: diagnostic ESG snapshots
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '[]',
  scores JSONB NOT NULL DEFAULT '{}',
  contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create action_statuses table for tracking plan action completion
CREATE TABLE IF NOT EXISTS public.action_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  action_id text NOT NULL,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  notes text,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(organization_id, action_id)
);

ALTER TABLE public.action_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "action_statuses_select_org" ON public.action_statuses
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "action_statuses_insert_org" ON public.action_statuses
  FOR INSERT WITH CHECK (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "action_statuses_update_org" ON public.action_statuses
  FOR UPDATE USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "action_statuses_delete_org" ON public.action_statuses
  FOR DELETE USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Create compliance_statuses table for tracking norm compliance
CREATE TABLE IF NOT EXISTS public.compliance_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  standard_id text NOT NULL,
  requirement_id text NOT NULL,
  status text NOT NULL DEFAULT 'na' CHECK (status IN ('conforme', 'partiel', 'non_conforme', 'na')),
  comment text,
  proof_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()),
  UNIQUE(organization_id, standard_id, requirement_id)
);

ALTER TABLE public.compliance_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compliance_statuses_select_org" ON public.compliance_statuses
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "compliance_statuses_insert_org" ON public.compliance_statuses
  FOR INSERT WITH CHECK (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "compliance_statuses_update_org" ON public.compliance_statuses
  FOR UPDATE USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "compliance_statuses_delete_org" ON public.compliance_statuses
  FOR DELETE USING (organization_id IN (
    SELECT organization_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their assessments"
ON public.assessments FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert assessments"
ON public.assessments FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Updated_at triggers
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_esg_data_updated_at
BEFORE UPDATE ON public.esg_data
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
