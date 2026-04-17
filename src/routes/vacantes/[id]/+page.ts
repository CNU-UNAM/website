// src/routes/vacantes/[id]/+page.ts
import type { PageLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageLoad = async ({ params }) => {
  const { id } = params;
  const vacancyId = parseInt(id, 10);

  if (isNaN(vacancyId)) {
    throw new Error('ID de vacante inválido');
  }

  const { data: vacancy, error } = await supabase
    .from('vacancies_postings')
    .select('*')
    .eq('id', vacancyId)
    .eq('active', 1)          // Solo vacantes activas
    .single();

  if (error || !vacancy) {
    throw new Error('Vacante no encontrada');
  }

  return { vacancy };
};