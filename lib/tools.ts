export interface Tool {
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    slug: "qr-generator",
    name: "QR Generator",
    description: "Genera códigos QR personalizados con el logo de tu marca.",
    href: "/tools/qr-generator",
    icon: "QrCode",
  },
];
