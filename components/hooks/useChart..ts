// hooks/useChat.ts
import { useChat as useAIReactChat } from "ai/react"
import { FormEvent } from "react"

interface UseChatOptions {
	api: string
	// 其他选项
}

// const useChat = (options: UseChatOptions) => {
//     const { api, ...rest } = options;
//
//     const handleSubmit = async (e: FormEvent<HTMLFormElement>, extraData: any = {}) => {
//         e.preventDefault();
//
//         const formData = new FormData(e.currentTarget);
//         const message = formData.get("message");
//
//         if (!message) {
//             return;
//         }
//
//         const body = {
//             message,
//             ...extraData, // 添加 account
//         };
//
//         try {
//             await fetch(api, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(body),
//             });
//         } catch (error) {
//             console.error("Error submitting chat:", error);
//             // 处理错误
//         }
//     };
//
//     const chat = useAIReactChat({
//         ...rest,
//         handleSubmit: (e: FormEvent<HTMLFormElement>) => handleSubmit(e, {}), // 传递 handleSubmit
//     });
//
//     return {
//         ...chat,
//         handleSubmit: (e: FormEvent<HTMLFormElement>, extraData: any = {}) => handleSubmit(e, extraData), // 导出 handleSubmit
//     };
// };
//
// export default useChat;
