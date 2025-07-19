import GuideWrapper from "@/components/GuideWrapper";
import { getDictionary } from "@/get-dictionary";
import { i18n, Locale } from "@/i18n-config";
import GuideProfile from "@/components/GuideProfile";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  return (
    <GuideWrapper dict={dict} lang={params.lang}>
      <GuideProfile dict={dict} />
    </GuideWrapper>
  );
}

export default Page;
