// import { db } from "@/app/db";
// import { pets } from "@/app/db/schema";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { currentUser } from "@clerk/nextjs/server";
// import { uploadImage } from "@/app/lib/cloudinary";

// export default function AdminDashboard() {
//     const { register, handleSubmit } = useForm();
//     const user = currentUser();

//     if (!user || !user.publicMetadata.admin) return <div>Access denied</div>;

//     const onSubmit = async (data) => {
//         const imageUrl = await uploadImage(data.image);
//         await db
//             .insert(pets)
//             .values({
//                 name: data.name,
//                 type: data.type,
//                 age: data.age,
//                 health: data.health,
//                 inoculations: data.inoculations,
//                 habits: data.habits,
//                 imageUrl,
//                 userId: user.id,
//             })
//             .execute();
//         // Refresh page
//     };

//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <FormField
//                     control={<Input {...register("name")} />}
//                     name="name"
//                     label="Pet Name"
//                 />
//                 <FormField
//                     control={<Input {...register("type")} />}
//                     name="type"
//                     label="Pet Type"
//                 />
//                 <FormField
//                     control={<Input {...register("age")} />}
//                     name="age"
//                     label="Age"
//                 />
//                 <FormField
//                     control={<Textarea {...register("health")} />}
//                     name="health"
//                     label="Health"
//                 />
//                 <FormField
//                     control={<Textarea {...register("inoculations")} />}
//                     name="inoculations"
//                     label="Inoculations"
//                 />
//                 <FormField
//                     control={<Textarea {...register("habits")} />}
//                     name="habits"
//                     label="Habits"
//                 />
//                 <FormField
//                     control={<Input type="file" {...register("image")} />}
//                     name="image"
//                     label="Image"
//                 />
//                 <Button type="submit">Add Pet</Button>
//             </Form>
//         </div>
//     );
// }


import { db } from "@/configs/db";
import { pets } from "@/configs/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@clerk/nextjs/server";
import { uploadImage } from "../lib/cloudinary";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const user = await currentUser();
    if (!user || !user.publicMetadata.admin) return <div>Access denied</div>;

    async function addPet(formData) {
        "use server";
        try {
            const name = formData.get("name")?.toString();
            const type = formData.get("type")?.toString();
            const age = formData.get("age")?.toString();
            const file = formData.get("image");
            const health = formData.get("health")?.toString() || "";
            const inoculations = formData.get("inoculations")?.toString() || "";
            const habits = formData.get("habits")?.toString() || "";

            if (!name || !type || !age || !file) {
                throw new Error("Name, type, age, and image are required");
            }

            const imageUrl = await uploadImage(file);

            await db
                .insert(pets)
                .values({
                    name,
                    type,
                    age,
                    health,
                    inoculations,
                    habits,
                    imageUrl,
                    userId: user.id,
                })
                .execute();

            redirect("/feed");
        } catch (error) {
            console.error("Admin add pet error:", error.message);
            throw error;
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4 text-purple-200">Admin Dashboard</h1>
            <form action={addPet} className="space-y-4 max-w-lg">
                <div>
                    <label className="text-purple-200">Pet Name</label>
                    <Input name="name" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Pet Type</label>
                    <Input name="type" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Age</label>
                    <Input name="age" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Health</label>
                    <Textarea name="health" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Inoculations</label>
                    <Textarea name="inoculations" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Habits</label>
                    <Textarea name="habits" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <div>
                    <label className="text-purple-200">Image</label>
                    <Input type="file" name="image" accept="image/*" className="bg-purple-800/50 text-purple-200 border-purple-400" />
                </div>
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full"
                >
                    Add Pet
                </Button>
            </form>
        </div>
    );
}