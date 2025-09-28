// src/pages/api/images.js
import { v2 as cloudinary } from "cloudinary";

export async function GET() {
  //const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;
  //const api_key = import.meta.env.CLOUDINARY_API_KEY;
  //const api_secret = import.meta.env.CLOUDINARY_API_SECRET;


 //const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;
    const cloud_name = "dxytyvnn2";
//  const api_key = import.meta.env.CLOUDINARY_API_KEY;
  const api_key = "596444497438862";
//  const api_secret = import.meta.env.CLOUDINARY_API_SECRET;
  const api_secret = "k8GvXdAhy880WyDj61zwpiH6XJU";

  if (!cloud_name || !api_key || !api_secret) {
    return new Response(
      JSON.stringify({ error: "Faltan credenciales" }),
      { status: 500 }
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret });

  try {
    const result = await cloudinary.search
      .expression("folder:rodar/posters AND resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

//console.log('isServer?', typeof window === 'undefined');


    const images = result.resources.map(r => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      created_at: r.created_at
    }));

  //  console.log(images)
;
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en /api/images:", error);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}