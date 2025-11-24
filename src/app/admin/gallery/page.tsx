// "use client";

// import { useEffect, useState } from "react";
// import AdminLayout from "@/components/admin/AdminLayout";
// import ImageUploader from "@/components/admin/ImageUploader";
// import { GalleryType } from "@/types/gallery";

// export default function GalleryAdminPage() {
//   const [images, setImages] = useState<GalleryType[]>([]);
//   const [formData, setFormData] = useState<Partial<GalleryType>>({});
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     fetch("/api/gallery")
//       .then((res) => res.json())
//       .then(setImages);
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const method = isEditing ? "PUT" : "POST";
//     const endpoint = isEditing
//       ? `/api/admin/gallery/${formData._id}`
//       : "/api/gallery";

//     const res = await fetch(endpoint, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     if (res.ok) {
//       setFormData({});
//       setIsEditing(false);
//       const updated = await fetch("/api/gallery").then((r) => r.json());
//       setImages(updated);
//     }
//   };

//   const handleEdit = (image: GalleryType) => {
//     setFormData(image);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id: string) => {
//     await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
//     setImages(images.filter((i) => i._id !== id));
//   };

//   return (
//     <AdminLayout>
//       <h1>Manage Gallery</h1>

//       <form onSubmit={handleSubmit} className="admin-form">
//         <input
//           name="title"
//           value={formData.title || ""}
//           onChange={handleChange}
//           placeholder="Title (optional)"
//         />
//         <ImageUploader
//           imageUrl={formData.imageUrl}
//           onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
//         />
//         <button type="submit">{isEditing ? "Update" : "Add"} Image</button>
//       </form>

//       <ul className="admin-list">
//         {images.map((img) => (
//           <li key={img._id}>
//             <img
//               src={img.imageUrl}
//               width={100}
//               alt={img.title || "Gallery image"}
//             />
//             {img.title && <p>{img.title}</p>}
//             <button onClick={() => handleEdit(img)}>Edit</button>
//             <button onClick={() => handleDelete(img._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </AdminLayout>
//   );
// }
