import type { Actions } from './$types';
import { supabaseAdmin } from '$lib/supabase.server'; // Cliente con service_role (solo servidor)

export const actions = {
  apply: async ({ request }) => {
    try {
      console.log('Iniciando acción apply en [id]');
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

      console.log('Datos recibidos en [id]:', { vacancyId, fullName, email, faculty, career, phone, coverLetter, cvFile: cvFile ? cvFile.name : null });

      // Validaciones
      if (!vacancyId || !fullName || !email || !faculty || !career || !cvFile) {
        console.log('Faltan campos obligatorios en [id]');
        throw new Error('Faltan campos obligatorios (nombre, email, facultad, carrera, CV).');
      }

      // Validar tipo de archivo
      const fileExt = cvFile.name.split('.').pop()?.toLowerCase();
      const allowedExts = ['pdf', 'docx', 'txt'];
      if (!fileExt || !allowedExts.includes(fileExt)) {
        console.log('Tipo de archivo inválido en [id]:', fileExt);
        throw new Error('Tipo de archivo no permitido. Solo se aceptan PDF, DOCX o TXT.');
      }

      // Validar tamaño del archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (cvFile.size > maxSize) {
        console.log('Archivo demasiado grande en [id]:', cvFile.size);
        throw new Error('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      }

      console.log('Validaciones pasadas en [id], subiendo archivo...');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Email inválido en [id]:', email);
        throw new Error('El correo electrónico no es válido.');
      }

      // 1. Subir CV al bucket 'documentos'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      console.log('Subiendo a [id]:', filePath);
      const { error: uploadError } = await supabaseAdmin.storage
        .from('documentos')
        .upload(filePath, cvFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error al subir CV en [id]:', uploadError);
        return { success: false, message: `Error al subir el CV: ${uploadError.message}` };
      }

      console.log('Archivo subido en [id], obteniendo URL...');
      // Obtener URL firmada (signed URL) para acceso seguro
      const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
        .from('documentos')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 año de expiración

      if (signedError) {
        console.error('Error al crear URL firmada en [id]:', signedError);
        return { success: false, message: `Error al generar URL del CV: ${signedError.message}` };
      }

      const cvUrl = signedUrlData.signedUrl;
      console.log('URL firmada obtenida en [id]:', cvUrl);
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
        console.error('Error al insertar en BD en [id]:', dbError);
        throw new Error(`Error al guardar la postulación: ${dbError.message}`);
      }

      console.log('Postulación guardada exitosamente en [id]');
      return { type: 'success', data: { message: '¡Postulación enviada con éxito!' } };
    } catch (err) {
      console.error('Error inesperado en apply [id]:', err);
      throw new Error(err instanceof Error ? err.message : 'Error desconocido en el servidor.');
    }
  }
} satisfies Actions;