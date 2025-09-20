
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Edit, Star, MapPin, Building, Mail, Phone, Save, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { translateText } from "@/ai/flows/translate-text";

const avatarImage = PlaceHolderImages.find(img => img.id === "avatar-1");
const artCategories = ["Pottery", "Woodwork", "Jewelry", "Textiles", "Paintings"];

const initialProfileData = {
    name: "Rohan Joshi",
    location: "Jaipur, Rajasthan",
    companyName: "Joshi Wooden Crafts",
    experienceValue: "15+ Years",
};

type TranslatedContent = {
    title: string;
    description: string;
    reviewsText: string;
    editButton: string;
    saveButton: string;
    cancelButton: string;
    professionalDetailsTitle: string;
    placeOfWorkLabel: string;
    companyLabel: string;
    experienceLabel: string;
    personalDetailsTitle: string;
    personalDetailsDescription: string;
    emailLabel: string;
    phoneLabel: string;
    nameLabel: string;
    name: string;
    location: string;
    companyName: string;
    experienceValue: string;
    categories: string[];
};


function Profile() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(initialProfileData);
    const [tempProfileData, setTempProfileData] = useState(initialProfileData);

    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const originalContent = {
            title: "My Profile",
            description: "View and manage your public and private information.",
            reviewsText: "(152 reviews)",
            editButton: "Edit",
            saveButton: "Save",
            cancelButton: "Cancel",
            professionalDetailsTitle: "Professional Details",
            placeOfWorkLabel: "Place of Work",
            companyLabel: "Company",
            experienceLabel: "Experience:",
            personalDetailsTitle: "Personal Details",
            personalDetailsDescription: "These details are only visible to you and accepted sponsors.",
            emailLabel: "Email",
            phoneLabel: "Phone Number",
            nameLabel: "Full Name",
            // Dynamic-like content from state
            name: profileData.name,
            location: profileData.location,
            companyName: profileData.companyName,
            experienceValue: profileData.experienceValue,
            categories: artCategories,
        };

        const translate = async () => {
            if (lang === 'en') {
                setTranslatedContent(originalContent);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const textsToTranslate = [
                    ...Object.values(originalContent).filter(v => typeof v === 'string'),
                    ...originalContent.categories,
                ];

                const translations = await Promise.all(
                    textsToTranslate.map(text => translateText({ text, targetLanguage: lang }))
                );
                
                let i = 0;
                const newContent: TranslatedContent = {
                    title: translations[i++].translatedText,
                    description: translations[i++].translatedText,
                    reviewsText: translations[i++].translatedText,
                    editButton: translations[i++].translatedText,
                    saveButton: translations[i++].translatedText,
                    cancelButton: translations[i++].translatedText,
                    professionalDetailsTitle: translations[i++].translatedText,
                    placeOfWorkLabel: translations[i++].translatedText,
                    companyLabel: translations[i++].translatedText,
                    experienceLabel: translations[i++].translatedText,
                    personalDetailsTitle: translations[i++].translatedText,
                    personalDetailsDescription: translations[i++].translatedText,
                    emailLabel: translations[i++].translatedText,
                    phoneLabel: translations[i++].translatedText,
                    nameLabel: translations[i++].translatedText,
                    name: translations[i++].translatedText,
                    location: translations[i++].translatedText,
                    companyName: translations[i++].translatedText,
                    experienceValue: translations[i++].translatedText,
                    categories: translations.slice(i).map(t => t.translatedText),
                };

                setTranslatedContent(newContent);
            } catch (error) {
                console.error("Failed to translate profile page:", error);
                setTranslatedContent(originalContent);
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [lang, profileData]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Save changes
            setProfileData(tempProfileData);
        } else {
            // Start editing
            setTempProfileData(profileData);
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setTempProfileData(profileData); // Revert changes
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setTempProfileData(prev => ({ ...prev, [id]: value }));
    }

    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>;
    }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      <Card>
        <CardHeader className="relative">
          <div className="absolute top-2 right-2 flex gap-2">
            {isEditing ? (
                 <>
                    <Button variant="outline" size="sm" onClick={handleCancel}><X className="mr-2 h-4 w-4"/> {translatedContent.cancelButton}</Button>
                    <Button variant="default" size="sm" onClick={handleEditToggle}><Save className="mr-2 h-4 w-4"/> {translatedContent.saveButton}</Button>
                 </>
            ) : (
                <Button variant="accent" size="sm" onClick={handleEditToggle}><Edit className="mr-2 h-4 w-4"/> {translatedContent.editButton}</Button>
            )}
          </div>
          <div className="flex flex-col items-center gap-4 pt-8 sm:pt-0">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              <AvatarImage src={avatarImage?.imageUrl} alt="Artisan" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="text-center">
              {isEditing ? (
                  <div className="w-full max-w-sm mx-auto">
                      <Label htmlFor="name" className="sr-only">{translatedContent.nameLabel}</Label>
                      <Input id="name" value={tempProfileData.name} onChange={handleInputChange} className="text-center font-headline text-2xl h-10" />
                  </div>
              ) : (
                  <CardTitle className="font-headline text-2xl">{translatedContent.name}</CardTitle>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-500" />
                </div>
                <span className="text-muted-foreground text-sm">{translatedContent.reviewsText}</span>
              </div>
               <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {translatedContent.categories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
               </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6 grid grid-cols-1 gap-8">
            <div className="space-y-6">
                <h3 className="font-headline text-xl font-semibold">{translatedContent.professionalDetailsTitle}</h3>
                 <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">{translatedContent.placeOfWorkLabel}</p>
                        {isEditing ? (
                            <Input id="location" value={tempProfileData.location} onChange={handleInputChange} className="h-8 mt-1" />
                        ) : (
                            <p className="text-muted-foreground">{translatedContent.location}</p>
                        )}
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Building className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">{translatedContent.companyLabel}</p>
                        {isEditing ? (
                            <Input id="companyName" value={tempProfileData.companyName} onChange={handleInputChange} className="h-8 mt-1" />
                        ) : (
                            <p className="text-muted-foreground">{translatedContent.companyName}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <p className="font-semibold flex-shrink-0">{translatedContent.experienceLabel}</p>
                     {isEditing ? (
                        <Input id="experienceValue" value={tempProfileData.experienceValue} onChange={handleInputChange} className="h-8 text-right flex-1" />
                     ) : (
                        <p className="text-muted-foreground text-right w-full">{translatedContent.experienceValue}</p>
                     )}
                </div>
            </div>
             <div className="space-y-6">
                <h3 className="font-headline text-xl font-semibold">{translatedContent.personalDetailsTitle}</h3>
                <p className="text-sm text-muted-foreground italic">{translatedContent.personalDetailsDescription}</p>
                 <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">{translatedContent.emailLabel}</p>
                        <p className="text-muted-foreground break-all">rohan.joshi@example.com</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">{translatedContent.phoneLabel}</p>
                        <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Profile />
        </Suspense>
    )
}
