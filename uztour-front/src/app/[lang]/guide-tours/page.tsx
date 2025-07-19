import GuideTours from "@/components/GuideTours";
import GuideWrapper from "@/components/GuideWrapper";
import { getDictionary } from "@/get-dictionary";
import { i18n, Locale } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return (
    <GuideWrapper dict={dict} lang={params.lang}>
      <GuideTours />
    </GuideWrapper>
  );
}

export default Page;
