// import { useEffect } from "react";
// import { onMessage, getToken } from "firebase/messaging";
// import { messaging } from "../utils/firebase";
// import toast from "react-hot-toast";

// const VITE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

// const NotificationListener = () => {
//   useEffect(() => {
//     if (typeof window === "undefined" || !messaging) return;

//     const setupNotifications = async () => {  
//       try {
//         const permission = await Notification.requestPermission();

//         if (permission !== "granted") {
//           console.warn("🚫 Notification permission denied");
//           return;
//         }

//         const existingToken = localStorage.getItem("fcm_token");

//         if (existingToken) {
//           console.log("✅ Token already in localStorage:", existingToken);
//         } else {
//           const token = await getToken(messaging, {
//             vapidKey: VITE_VAPID_KEY,
//           });

//           if (token) {
//             console.log("🆕 New token generated:", token);
//             localStorage.setItem("fcm_token", token);
//           } else {
//             console.warn("⚠️ No registration token available.");
//           }
//         }

//         const unsubscribe = onMessage(messaging, (payload) => {
//           const { title, body } = payload.notification;
//           console.log("🔔 Foreground notification received:", payload);

//           toast.custom((t) => (
//             <div
//               className={`${
//                 t.visible ? "animate-enter" : "animate-leave"
//               } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//             >
//               <div className="flex-1 w-0 p-4">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0 pt-0.5">
//                     <img
//                       className="h-10 w-10 rounded-full"
//                       src="/firebase-icon.png"
//                       alt="Notification"
//                     />
//                   </div>
//                   <div className="ml-3 flex-1">
//                     <p className="text-sm font-medium text-gray-900">{title}</p>
//                     <p className="mt-1 text-sm text-gray-500">{body}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex border-l border-gray-200">
//                 <button
//                   onClick={() => toast.dismiss(t.id)}
//                   className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           ));
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("❌ Error in notification setup:", error);
//       }
//     };

//     const cleanup = setupNotifications();

//     return () => {
//       if (cleanup && typeof cleanup === "function") cleanup();
//     };
//   }, []);

//   return null;
// };

// export default NotificationListener;
