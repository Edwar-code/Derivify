import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, FileUp, Banknote, CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Instant Generation",
    description: "Receive your documents in minutes, not days. Our automated system works around the clock.",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Secure & Confidential",
    description: "Your data is encrypted and handled with the utmost care. We prioritize your privacy.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Verified Formats",
    description: "Documents are generated in officially recognized formats to ensure high acceptance rates.",
  },
];

const documents = [
  { name: "KRA Returns Document", icon: <FileText className="w-6 h-6 text-muted-foreground" /> },
  { name: "Utility Electricity Bill", icon: <Building className="w-6 h-6 text-muted-foreground" /> },
  { name: "Affidavit for Proof", icon: <FileUp className="w-6 h-6 text-muted-foreground" /> },
  { name: "Bank Statement", icon: <Banknote className="w-6 h-6 text-muted-foreground" /> },
];

export default function PublicPage() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  The Ultimate Platform for All Your Document Needs
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Derivify provides fast, reliable, and secure document generation for proof of address, financial statements, and more. Get what you need, right when you need it.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="document verification"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Why Choose Us?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We streamline the process of obtaining essential documents, saving you time and effort with a platform built on trust and efficiency.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="grid gap-4 text-center">
                <div className="flex justify-center items-center">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-t border-b">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-foreground">
              A Wide Range of Documents
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From financial records to legal affidavits, we have you covered. All documents are created to meet standard verification requirements.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <div className="grid grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-4 rounded-lg border bg-background">
                        {doc.icon}
                        <span className="font-medium text-foreground">{doc.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      
       <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account in seconds and get your first document today.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">Create an Account</Link>
            </Button>
          </div>
        </div>
       </section>
    </div>
  );
}