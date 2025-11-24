// // src/components/admin/ImageUploader.tsx
// "use client";

// import { useState } from "react";
// import Image from "next/image";

// export default function ImageUploader({
//   imageUrl,
//   onUpload,
// }: {
//   imageUrl?: string;
//   onUpload: (url: string) => void;
// }) {
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     // Use FormData for file upload
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     if (data.url) {
//       onUpload(data.url); // Cloudinary image URL
//     } else {
//       alert(data.error || "Upload failed.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       {imageUrl && (
//         <Image
//           src={imageUrl}
//           alt="Uploaded"
//           width={100}
//           height={100}
//           style={{ objectFit: "cover" }}
//         />
//       )}
//       <input type="file" onChange={handleUpload} />
//       {loading && <p>Uploading...</p>}
//     </div>
//   );
// }
