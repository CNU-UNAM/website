import type { Actions } from './$types';
import { supabaseAdmin } from '$lib/supabase'; // Cliente con service_role (solo servidor)

export const actions = {
  apply: async ({ request }) => {
    try {
      // Obtener datos del formulario
      const formData = await request.formData();

      const vacancyId = formData.get('vacancyId') as string;
      const fullName = formData.get('full_name') as string;
      const email = formData.get('email') as string;
      const faculty = formData.get('faculty') as string;
      const career = formData.get('career') as string;
      const phone = formData.get('phone') as string;
      const coverLetter = formData.get('cover_letter') as string;
      const cvFile = formData.get('cv') as File;

      // Validaciones
      if (!vacancyId || !fullName || !email || !faculty || !career || !cvFile) {
        return { success: false, message: 'Faltan campos obligatorios (nombre, email, facultad, carrera, CV).' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'El correo electrónico no es válido.' };
      }

      // 1. Subir CV al bucket 'documentos'
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('documentos')
        .upload(filePath, cvFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error al subir CV:', uploadError);
        return { success: false, message: `Error al subir el CV: ${uploadError.message}` };
      }

      // Obtener URL pública del archivo subido
      const { data: urlData } = supabaseAdmin.storage.from('documentos').getPublicUrl(filePath);
      const cvUrl = urlData.publicUrl;

      // 2. Guardar la postulación en la tabla 'applications'
      const { error: dbError } = await supabaseAdmin
        .from('applications')
        .insert({
          vacancy_id: vacancyId,
          full_name: fullName,
          email: email,
          faculty: faculty,
          career: career,
          phone: phone || null,
          cover_letter: coverLetter || null,
          cv_url: cvUrl,
          status: 'pending'
        });

      if (dbError) {
        console.error('Error al insertar en BD:', dbError);
        return { success: false, message: `Error al guardar la postulación: ${dbError.message}` };
      }

      return { success: true, message: '¡Postulación enviada con éxito!' };
    } catch (err) {
      console.error('Error inesperado en apply:', err);
      return { success: false, message: err instanceof Error ? err.message : 'Error desconocido en el servidor.' };
    }
  }
} satisfies Actions;