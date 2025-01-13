const apiDocs = `
# Documentación de la API

## Endpoints

### Subapartados

#### Crear un Subapartado
- **Método:** POST
- **URL:** /api/subsections
- **Headers:** 
  - Authorization: Bearer {{token}}
- **Body:**
\`\`\`json
{
    "name": "Nombre del Subapartado",
    "category": "recursos",
    "description": "Descripción del subapartado",
    "rules": [
        {
            "title": "Título de la regla",
            "description": "Descripción de la regla"
        }
    ]
}
\`\`\`
- **Respuesta:**
\`\`\`json
{
    "data": { ... },
    "message": "Subapartado creado exitosamente"
}
\`\`\`

#### Obtener Todos los Subapartados
- **Método:** GET
- **URL:** /api/subsections
- **Respuesta:**
\`\`\`json
{
    "data": [ ... ],
    "metadata": {
        "total": 10,
        "count": 10
    }
}
\`\`\`

### Posts

#### Crear un Post
- **Método:** POST
- **URL:** /api/posts
- **Headers:** 
  - Authorization: Bearer {{token}}
- **Body:**
\`\`\`json
{
    "title": "Título del Post",
    "content": "Contenido del post",
    "subSection": "ID_DEL_SUBAPARTADO"
}
\`\`\`
- **Respuesta:**
\`\`\`json
{
    "data": { ... },
    "message": "Post creado exitosamente"
}
\`\`\`

#### Obtener Posts por Subapartado
- **Método:** GET
- **URL:** /api/posts/SUBSECTION_ID
- **Respuesta:**
\`\`\`json
{
    "data": [ ... ]
}
\`\`\`
`;

export default apiDocs; 