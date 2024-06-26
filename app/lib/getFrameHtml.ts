import { FrameMetadataType, getFrameHtmlResponse } from "@coinbase/onchainkit";

export function getFrameHtml(frameMetadata: FrameMetadataType) {
  const html = getFrameHtmlResponse(frameMetadata);

  const extraTags = [
    '<meta property="og:title" content="Frogue">',
    '<meta property="og:description" content="Frogue on-chain-gamme">',
    '<meta property="og:image" content="https://frameworks-frogue.vercel.app/background-images/01_start.png">',
    '<meta property="fc:frame:image:aspect_ratio" content="1.91:1" />',
  ];
  // hack: remove close tags, add aspect ratio and required OG tags
  return `${html.slice(0, html.length - 14)}${extraTags.join("")}</head></html>`;
}
