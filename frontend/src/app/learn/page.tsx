"use client";

import { ShieldAlert, CreditCard, UserX, Smartphone, AlertTriangle } from "lucide-react";

export default function LearnPage() {
  const threats = [
    {
      title: "Phishing Scams",
      icon: <ShieldAlert className="text-red-500" size={32} />,
      description: "Phishing is a deceptive attempt to steal sensitive information by masquerading as a trustworthy entity (like a bank, IRS, or tech support) in an electronic communication.",
      tactics: ["Urgency ('Your account will be suspended!')", "Authority ('This is Officer Smith')", "False Links (Fake login pages)"],
      defense: "Never click unsolicited links. Verify the sender by checking the actual email address or calling the official organization number directly."
    },
    {
      title: "Identity Theft",
      icon: <UserX className="text-blue-500" size={32} />,
      description: "Identity theft occurs when someone uses your personal information—like your name, Social Security number, or credit card number—without your permission to commit fraud.",
      tactics: ["Data Breaches", "Dumpster Diving", "Social Engineering (Tricking you into revealing info)"],
      defense: "Monitor your credit reports regularly. Never give out your SSN or personal details to cold callers. Use strong, unique passwords."
    },
    {
      title: "Digital Payment Fraud",
      icon: <CreditCard className="text-green-500" size={32} />,
      description: "Scammers exploit digital wallets and payment apps (like Zelle, Venmo, UPI) by tricking you into sending money for fake services, or claiming they 'accidentally' sent you money.",
      tactics: ["Overpayment Scams", "Fake Invoices", "Urgent Family Emergencies ('Grandparent scam')"],
      defense: "Treat payment apps like cash. Only send money to people you know personally. Never return an 'accidental' payment—tell them to cancel it through their bank."
    },
    {
      title: "Vishing (Voice Phishing)",
      icon: <Smartphone className="text-yellow-500" size={32} />,
      description: "Fraudulent phone calls designed to manipulate you into revealing financial information. Often involves aggressive tactics or spoofed Caller IDs to appear legitimate.",
      tactics: ["Fear (Threats of arrest)", "Spoofed Caller ID", "Isolation ('Do not tell anyone about this call')"],
      defense: "Hang up immediately if you feel pressured. Do not trust Caller ID. Legitimate organizations will never demand immediate payment via gift cards or crypto."
    }
  ];

  return (
    <div className="font-mono space-y-12 max-w-4xl mx-auto">
      <div className="space-y-4 border-b border-neutral-800 pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">CYBER AWARENESS PORTAL</h1>
        <p className="text-neutral-500 uppercase tracking-widest text-sm max-w-2xl mx-auto">
          Understand the psychology of manipulation. Recognize the threats. Protect your assets.
        </p>
      </div>

      <div className="space-y-8">
        {threats.map((threat, idx) => (
          <div key={idx} className="brutalist-border p-6 bg-neutral-950 flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-black brutalist-border shrink-0">
              {threat.icon}
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-2xl font-bold tracking-tight">{threat.title}</h2>
              <p className="text-neutral-300 leading-relaxed">
                {threat.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Common Tactics</h3>
                  <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                    {threat.tactics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 bg-neutral-900 p-4 brutalist-border">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    Defense Strategy
                  </h3>
                  <p className="text-sm text-neutral-300">
                    {threat.defense}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
