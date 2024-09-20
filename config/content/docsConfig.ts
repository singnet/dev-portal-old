export default (isDark) => {
    console.log("isDark in config: ", isDark);
    const themeFolder = isDark ? 'dark' : 'light';

    return [
    {
        text: "Airdrop",
        textIconID: "airdrop-icon",
        imageSrc: `/assets/images/common/${themeFolder}/airdrop.png`,
        description: "All relevant documentation about the Airdrop in SingularityNET.",
        link: "/docs/products/Airdrop/"
    },
    {
        text: "Bridge",
        textIconID:"bridge-icon",
        imageSrc:`/assets/images/common/${themeFolder}/bridge.png`,
        description: "All relevant documentation about the Bridge project",
        link: "/docs/products/Bridge/",
    },
    {
        text: "Staking",
        textIconID: "staking-icon",
        imageSrc: `/assets/images/common/${themeFolder}/staking.png`,
        description:
            "All relevant documentation about the Staking project.",
        link: "/docs/products/Staking/"
    },
    {
        text: "AI Platform Ecosystem",
        textIconID: "marketplace-icon",
        imageSrc: `/assets/images/common/${themeFolder}/platform.png`,
        description:
            "Explore, publish, and integrate AI services on AI Marketplace's docs.",
        link: "/docs/products/AIMarketplace/coreconcepts/Marketplace-ecosystem/marketplace"
    },
    {
        text: "About technologies",
        textIconID: "techs-icon",
        imageSrc: `/assets/images/common/${themeFolder}/techs.png`,
        description:
            "A documentary overview of the stack of all technologies that are used in our projects",
        link: "/docs/products/AboutTechnologies/blockchain"
    },
    {
        text: "WaLT",
        textIconID: "walt-icon",
        imageSrc: `/assets/images/common/${themeFolder}/walt.png`,
        description: "Connect Linked Wallet Tool",
        link: "/docs/products/WaLT/"
    }
]};
