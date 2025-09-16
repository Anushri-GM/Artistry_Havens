import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArtistryHavensLogo } from "@/components/icons";

const languages = [
  { name: "English", native: "English", code: "en" },
  { name: "Hindi", native: "हिंदी", code: "hi" },
  { name: "Bengali", native: "বাংলা", code: "bn" },
  { name: "Telugu", native: "తెలుగు", code: "te" },
  { name: "Tamil", native: "தமிழ்", code: "ta" },
  { name: "Urdu", native: "اردو", code: "ur" },
];

export default function LanguageSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
            <ArtistryHavensLogo className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-foreground">
          Welcome to Artistry Havens
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          To Choose a Language
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {languages.map((lang, index) => (
          <Link key={lang.code} href={`/role-selection?lang=${lang.code}`} passHref>
            <Card className="transform-gpu cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className={`flex h-40 w-40 flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background`}>
                <div className="text-4xl font-bold text-primary">{lang.native}</div>
                <div className="mt-2 text-sm text-muted-foreground">{lang.name}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-muted-foreground italic">
        Where Every Creation Belongs.
      </p>
    </div>
  );
}
