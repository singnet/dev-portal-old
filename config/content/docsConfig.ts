export interface HomeSectionItem {
    text: string;
    textIconID: string;
    imageFileName: string;
    description: string;
    link: string;
}

export default [
    {
        text: "Airdrop",
        textIconID: "airdrop-icon",
        imageFileName: "airdrop.webp",
        description: "All relevant documentation about the Airdrop in SingularityNET.",
        link: "/docs/products/Airdrop/"
    },
    {
        text: "Bridge",
        textIconID:"bridge-icon",
        imageFileName:"bridge.webp",
        description: "All relevant documentation about the Bridge project",
        link: "/docs/products/Bridge/",
    },
    {
        text: "Staking",
        textIconID: "staking-icon",
        imageFileName: "staking.webp",
        description:
            "All relevant documentation about the Staking project.",
        link: "/docs/products/Staking/"
    },
    {
        text: "AI Platform Ecosystem",
        textIconID: "marketplace-icon",
        imageFileName: "platform.webp",
        description:
            "Explore, publish, and integrate AI services on AI Marketplace's docs.",
        link: "/docs/products/AIMarketplace/"
    },
    {
        text: "About technologies",
        textIconID: "techs-icon",
        imageFileName: "techs.webp",
        description:
            "A documentary overview of the stack of all technologies that are used in our projects",
        link: "/docs/products/AboutTechnologies/"
    },
    {
        text: "WaLT",
        textIconID: "walt-icon",
        imageFileName: "walt.webp",
        description: "Connect Linked Wallet Tool",
        link: "/docs/products/WaLT/"
    }
] as HomeSectionItem[];
