import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, FileUp, Banknote, CheckCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- UPDATED FEATURES ---
const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Fast & Efficient",
    description: "Trust our streamlined process to get your documents ready for verification faster than any traditional method.",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Legit & Compliant",
    description: "We create legitimate documents in officially recognized formats to ensure the highest acceptance rates.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: "Save Your Time",
    description: "Stop wasting hours on tedious paperwork. We handle the entire process for you, from creation to submission.",
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
      {/* --- HERO SECTION --- */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  Frustrated with Denied Proof of Address Verifications?
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Let us help you out. We create all the required, legitimate documents and push them for you to be verified. Trust us for the best and fastest verification possible.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Let's Get You Verified</Link>
                </Button>
              </div>
            </div>
            <Image
              src="/derivifybody.png"
              width="600"
              height="400"
              alt="Illustration of a person successfully verifying their documents online"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">We Are The Best at This</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We save you from the time and stress you would have spent getting these documents yourself. Just trust our platform for a seamless experience built on efficiency and reliability.
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

      {/* --- DOCUMENTS SECTION --- */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-t border-b">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-foreground">
              We Create All Required Documents
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

      {/* --- CTA SECTION --- */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">End the Frustration Today</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account in seconds and let us handle the rest. It's time to get verified without the headache.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">Create My Account</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card border-t border-b">
    <div className="container px-4 md:px-6 text-center">
        <h2 className="text-2xl font-bold text-foreground">Important Links</h2>
        <div className="flex flex-col space-y-2 mt-4">
            <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
                Terms and Conditions
            </Link>
        </div>
  

        </div>
      </section>
    </div>
  );
}
