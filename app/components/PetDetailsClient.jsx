"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Share2, Calendar, Shield, Activity, PawPrint, Phone, Mail, DollarSign, Download } from "lucide-react";
import ShareButton from "../components/ShareButton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            staggerChildren: 0.15,
            ease: "easeInOut",
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
    hover: {
        y: -10,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 },
    },
};

const buttonVariants = {
    hover: {
        scale: 1.1,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
        transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: { scale: 0.95 },
};

const InfoCard = ({ icon: Icon, title, content, delay = 0 }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-gradient-to-br from-purple-800/80 to-purple-600/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-500/30 backdrop-blur-sm"
    >
        <div className="flex items-center mb-3">
            <div className="bg-purple-300/20 p-2 rounded-lg mr-3">
                <Icon className="w-5 h-5 text-purple-200" />
            </div>
            <h3 className="font-semibold text-purple-100">{title}</h3>
        </div>
        <p className="text-purple-200 leading-relaxed">{content || "Not specified"}</p>
    </motion.div>
);

const DownloadButton = ({ pet }) => {
    const handleDownload = async () => {
        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            // Add colorful background gradient effect
            pdf.setFillColor(139, 69, 193); // Purple
            pdf.rect(0, 0, 210, 40, 'F'); // Header background

            pdf.setFillColor(230, 230, 250); // Light lavender
            pdf.rect(0, 40, 210, 257, 'F'); // Main content background

            // Add decorative border
            pdf.setDrawColor(139, 69, 193); // Purple border
            pdf.setLineWidth(2);
            pdf.rect(10, 10, 190, 277); // Outer border

            // Add title with white text on purple background
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(28);
            pdf.setTextColor(255, 255, 255); // White text
            pdf.text(`${pet.name}'s Profile`, 20, 25);

            // Add subtitle
            pdf.setFontSize(14);
            pdf.setTextColor(255, 255, 255);
            pdf.text("Pet Adoption Profile", 20, 35);

            // Add decorative line
            pdf.setDrawColor(255, 255, 255);
            pdf.setLineWidth(1);
            pdf.line(20, 37, 190, 37);

            // Add pet type badge
            pdf.setFillColor(255, 182, 193); // Light pink
            pdf.roundedRect(140, 15, 45, 12, 3, 3, 'F');
            pdf.setTextColor(139, 69, 193);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text(pet.type || "Pet", 145, 23);

            let yPosition = 50;

            // Add image with styled frame
            if (pet.imageUrl) {
                try {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = pet.imageUrl;
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = () => {
                            console.warn(`Failed to load image: ${pet.imageUrl}`);
                            reject(new Error("Image load failed"));
                        };
                    });

                    const imgElement = document.querySelector(`img[src="${pet.imageUrl}"]`);
                    if (imgElement) {
                        const canvas = await html2canvas(imgElement, {
                            scale: 2,
                            useCORS: true,
                            logging: true,
                        });
                        const imgData = canvas.toDataURL("image/jpeg", 0.8);
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = 130; // Larger width for better layout
                        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        // Calculate centered position
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const frameX = (pageWidth - pdfWidth - 10) / 2; // Center the frame
                        const imageX = frameX + 5; // Center the image within frame

                        // Add image frame (centered)
                        pdf.setFillColor(255, 255, 255); // White frame
                        pdf.rect(frameX, yPosition - 5, pdfWidth + 10, imgHeight + 10, 'F');
                        pdf.setDrawColor(139, 69, 193);
                        pdf.setLineWidth(2);
                        pdf.rect(frameX, yPosition - 5, pdfWidth + 10, imgHeight + 10);

                        // Add image (centered)
                        pdf.addImage(imgData, "JPEG", imageX, yPosition, pdfWidth, imgHeight);
                        yPosition += imgHeight + 20;
                    }
                } catch (imgError) {
                    console.warn("Failed to include image in PDF:", imgError);
                }
            }

            // Add section header
            pdf.setFillColor(139, 69, 193);
            pdf.rect(15, yPosition - 5, 180, 15, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("Pet Details", 20, yPosition + 5);
            yPosition += 20;

            // Define details with colors
            const details = [
                { label: "Age", value: pet.age || "Not specified", color: [255, 99, 132] },
                { label: "Health Status", value: pet.health || "Not specified", color: [54, 162, 235] },
                { label: "Inoculations", value: pet.inoculations || "Not specified", color: [255, 206, 86] },
                { label: "Habits & Personality", value: pet.habits || "Not specified", color: [75, 192, 192] },
                { label: "Contact Number", value: pet.contactNumber || "Not specified", color: [153, 102, 255] },
                { label: "Email Address", value: pet.emailAddress || "Not specified", color: [255, 159, 64] },
                {
                    label: "Adoption Type",
                    value: pet.isSelling === "selling" ? `For Sale: $${pet.price || "Not specified"}` : "Free Adoption",
                    color: [255, 99, 132]
                },
            ];

            details.forEach(({ label, value, color }, index) => {
                // Add white background with colored border for each detail
                pdf.setFillColor(255, 255, 255); // White background
                pdf.rect(15, yPosition - 3, 180, 12, 'F');

                // Add colored border
                pdf.setDrawColor(color[0], color[1], color[2]);
                pdf.setLineWidth(1);
                pdf.rect(15, yPosition - 3, 180, 12);

                // Add colored icon/bullet
                pdf.setFillColor(color[0], color[1], color[2]);
                pdf.circle(20, yPosition + 2, 2, 'F');

                // Add label
                pdf.setTextColor(color[0], color[1], color[2]);
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(12);
                pdf.text(`${label}:`, 25, yPosition + 3);

                // Add value with better contrast
                pdf.setTextColor(50, 50, 50); // Dark gray instead of black
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(11);

                // Handle long text wrapping
                const splitText = pdf.splitTextToSize(value, 120);
                pdf.text(splitText, 70, yPosition + 3);

                yPosition += Math.max(12, splitText.length * 5);
            });

            // Add decorative footer
            const footerY = pdf.internal.pageSize.getHeight() - 25;
            pdf.setFillColor(139, 69, 193);
            pdf.rect(0, footerY - 5, 210, 30, 'F');

            // Add footer text
            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Generated by Pet Adoption Platform", 20, footerY + 5);

            // Add current date
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            const currentDate = new Date().toLocaleDateString();
            pdf.text(`Generated on: ${currentDate}`, 20, footerY + 15);

            // Add decorative elements
            pdf.setFillColor(255, 182, 193);
            pdf.circle(180, footerY + 10, 8, 'F');
            pdf.setTextColor(139, 69, 193);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("♥", 176, footerY + 13);

            // Download the PDF
            pdf.save(`${pet.name.replace(/\s+/g, "_")}_profile.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
        >
            <Button
                onClick={handleDownload}
                className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white backdrop-blur-sm"
            >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
            </Button>
        </motion.div>
    );
};

export default function PetDetailsClient({ pet, isLiked, hasUser, petId, toggleLike }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto py-8 px-4 max-w-4xl mt-8"
            >
                {/* Header Section */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-gradient-to-br from-purple-800/90 to-indigo-800/90 rounded-2xl shadow-2xl overflow-hidden mb-8 border border-purple-500/30 mt-20"
                >
                    <div className="relative">
                        <motion.img
                            variants={imageVariants}
                            whileHover="hover"
                            src={pet.imageUrl}
                            alt={pet.name}
                            className="w-full h-80 md:h-96 object-cover mt-0 rounded-lg"
                            onError={() => console.error(`Failed to load pet image: ${pet.imageUrl}`)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <motion.div
                            variants={itemVariants}
                            className="absolute bottom-6 left-6 text-white"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-xl">
                                {pet.name}
                            </h1>
                            <div className="flex items-center space-x-2">
                                <span className="bg-purple-500/40 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                                    {pet.type}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Pet Details Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    <InfoCard icon={Calendar} title="Age" content={pet.age} delay={0.1} />
                    <InfoCard icon={Shield} title="Health Status" content={pet.health} delay={0.2} />
                    <InfoCard icon={Activity} title="Inoculations" content={pet.inoculations} delay={0.3} />
                    <InfoCard icon={PawPrint} title="Habits & Personality" content={pet.habits} delay={0.4} />
                    <InfoCard icon={Phone} title="Contact Number" content={pet.contactNumber} delay={0.5} />
                    <InfoCard icon={Mail} title="Email Address" content={pet.emailAddress} delay={0.6} />
                    <InfoCard
                        icon={DollarSign}
                        title="Adoption Type"
                        content={pet.isSelling === "selling" ? `For Sale: $${pet.price || "Not specified"}` : "Free Adoption"}
                        delay={0.7}
                    />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-gradient-to-br from-purple-800/90 to-indigo-800/90 rounded-2xl shadow-lg p-6 border border-purple-500/30"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {hasUser && (
                            <motion.form
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                action={toggleLike}
                            >
                                <input type="hidden" name="petId" value={petId} />
                                <Button
                                    type="submit"
                                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${isLiked
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-purple-500/30 hover:bg-purple-500/50 text-purple-100 hover:text-white"
                                        } backdrop-blur-sm`}
                                >
                                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                                    {isLiked ? "Unlike" : "Like"}
                                </Button>
                            </motion.form>
                        )}
                        <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <ShareButton petId={pet.id} />
                        </motion.div>
                        <DownloadButton pet={pet} />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}