import cloudinary
import cloudinary.api
import json

# Configuración de Cloudinary
cloudinary.config(
    cloud_name="dxytyvnn2",
    api_key="596444497438862",
    api_secret="k8GvXdAhy880WyDj61zwpiH6XJU"
)


# Paso 1: Listar los primeros 10 recursos del sistema
print("📂 Listando hasta 10 recursos generales...")
resources = cloudinary.api.resources(
    type="upload",
    resource_type="image",
    max_results=5000

)

for res in resources["resources"]:
    print(f"Public ID: {res['public_id']} | URL: {res['secure_url']}")


try:
    print("🔍 Listando carpetas raíz...")
    root_folders = cloudinary.api.root_folders()
    print(json.dumps(root_folders, indent=2))

    # Verificar si 'RODAR' está en carpetas raíz
    root_folder_names = [f["name"] for f in root_folders.get("folders", [])]
    if "RODAR" not in root_folder_names:
        print("❌ No se encontró la carpeta 'RODAR' en las carpetas raíz.")
        exit()

    print("\n🔍 Listando subcarpetas dentro de 'RODAR'...")
    subfolders = cloudinary.api.subfolders("RODAR")
    print(json.dumps(subfolders, indent=2))

    # Extraer nombres de subcarpetas
    subfolder_names = [f["name"] for f in subfolders.get("folders", [])]

    if "POSTERS" in subfolder_names:
        print("\n✅ Carpeta RODAR/POSTERS encontrada. Extrayendo imágenes...")

        # Obtener recursos con prefijo correcto
        resources = cloudinary.api.resources(
            type="upload",
            resource_type="image",  # Especificar tipo de recurso
            prefix="RODAR/POSTERS",  # Puede ir con o sin barra final
            max_results=500,
            context=False,         # Opcional: evita datos extra
            moderation=False       # Opcional
        )

        # Filtrar solo imágenes
        images = [res for res in resources["resources"] if res["resource_type"] == "image"]

        urls = [res["secure_url"] for res in images]

        # Guardar en archivo JSON
        with open("posters.json", "w") as f:
            json.dump(urls, f, indent=2)

        print(f"✅ Se han guardado {len(urls)} imágenes en posters.json")

    else:
        print("\n⚠️ No se encontró la carpeta 'POSTERS' dentro de 'RODAR'.")
        print("💡 Posibles causas:")
        print("   - No hay imágenes aún en esa carpeta.")
        print("   - Las imágenes están en otra carpeta.")
        print("   - El nombre tiene mayúsculas/minúsculas distintas (ej: 'posters').")
        print("   - La carpeta no existe realmente (aunque aparezca en uploads).")

except Exception as e:
    print("❌ Error:", str(e))