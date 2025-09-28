// src/pages/api/films.ts
import dbConnect from '../../lib/mongoose';
import FilmografiaModel from '../../lib/models/filmografia';

export const GET = async ({ request }) => {
  const url = new URL(request.url);
  const posterUrl = url.searchParams.get('poster');

  if (!posterUrl) {
    return new Response(
      JSON.stringify({ error: 'Falta el parámetro poster' }),
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const film = await FilmografiaModel.findOne({ urlPoster: decodeURIComponent(posterUrl) });

    if (!film) {
      return new Response(JSON.stringify(null), { status: 404 });
    }

    return new Response(JSON.stringify(film), { status: 200 });
  } catch (error) {
    console.error('Error al buscar película:', error);
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
  }
};