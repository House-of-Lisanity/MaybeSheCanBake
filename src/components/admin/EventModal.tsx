// "use client";

// import { useEffect, useState } from "react";
// import { EventType } from "@/types/event";

// type EventModalProps = {
//   event: EventType | null;
//   onClose: () => void;
//   onSave: () => void; // parent re-fetches after successful save/delete
// };

// export default function EventModal({
//   event,
//   onClose,
//   onSave,
// }: EventModalProps) {
//   const isEditing = Boolean(event?._id);

//   const [formData, setFormData] = useState<Partial<EventType>>({
//     title: "",
//     date: "",
//     location: "",
//     time: "",
//     description: "",
//     isPublished: true,
//   });

//   useEffect(() => {
//     if (event) {
//       setFormData({
//         _id: event._id,
//         title: event.title,
//         date: event.date,
//         location: event.location,
//         time: event.time,
//         description: event.description,
//         isPublished: event.isPublished ?? true,
//       });
//     } else {
//       setFormData({
//         title: "",
//         date: "",
//         location: "",
//         time: "",
//         description: "",
//         isPublished: true,
//       });
//     }
//   }, [event]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const target = e.target as HTMLInputElement | HTMLTextAreaElement;
//     const { name, value, type } = target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" && target instanceof HTMLInputElement
//           ? target.checked
//           : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const method = isEditing ? "PUT" : "POST";
//     const endpoint = isEditing
//       ? `/api/admin/events/${formData._id}`
//       : "/api/events";

//     const res = await fetch(endpoint, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     if (!res.ok) {
//       console.error("Failed to save event");
//       return;
//     }

//     onSave(); // parent re-fetches /api/events
//     onClose(); // close the modal
//   };

//   const handleDelete = async () => {
//     if (!formData._id) return;
//     const res = await fetch(`/api/admin/events/${formData._id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) {
//       console.error("Failed to delete event");
//       return;
//     }
//     onSave();
//     onClose();
//   };

//   return (
//     <div className="modal-overlay" role="dialog" aria-modal="true">
//       <div className="modal">
//         <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>

//         <form onSubmit={handleSubmit} className="admin-form">
//           <input
//             name="title"
//             value={formData.title || ""}
//             onChange={handleChange}
//             placeholder="Event Title"
//             required
//           />

//           <input
//             name="date"
//             type="date"
//             value={formData.date || ""}
//             onChange={handleChange}
//             required
//           />

//           <input
//             name="time"
//             value={formData.time || ""}
//             onChange={handleChange}
//             placeholder="Time (e.g., 9:00 AM – 1:00 PM)"
//           />

//           <input
//             name="location"
//             value={formData.location || ""}
//             onChange={handleChange}
//             placeholder="Location"
//             required
//           />

//           <textarea
//             name="description"
//             value={formData.description || ""}
//             onChange={handleChange}
//             placeholder="Description"
//           />

//           <label>
//             <input
//               type="checkbox"
//               name="isPublished"
//               checked={Boolean(formData.isPublished)}
//               onChange={handleChange}
//             />
//             Publish
//           </label>

//           <div className="modal-actions">
//             <button type="submit">
//               {isEditing ? "Update Event" : "Create Event"}
//             </button>
//             {isEditing && (
//               <button type="button" onClick={handleDelete}>
//                 Delete
//               </button>
//             )}
//             <button type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
