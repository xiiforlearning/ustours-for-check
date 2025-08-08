import { i18n, type Locale } from "../../i18n-config";
import Header from "../../components/Header";
import InitialLogic from "../../components/InitialLogic";
import "../globals.css";
import Footer from "../../components/Footer";
import { Suspense } from "react";
import { getDictionary } from "@/get-dictionary";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// export async function generateMetadata({
//   params,
// }: {
//   params: { lang: Locale };
// }) {
//   const { lang } = await params;
//   const disc = await getDictionary(lang);
//   return {
//     title: disc.seoTitle,
//     description: disc.seoDesc,
//   };
// }
type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};
export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
  searchParams: SearchParamProps;
}) {
  const params = await props.params;
  const { children } = props;

  const dict = await getDictionary(params.lang);

  return (
    <html>
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnjwmO6DLPoSChny0l-4yeJRoViEbbdhw&libraries=places&language=en"
        async
        defer
      ></script>
      <body>
        <InitialLogic />
        <Suspense>
          <Header dict={dict} lang={params.lang} />
        </Suspense>

        {children}
        <Footer lang={params.lang} dict={dict} />
      </body>
    </html>
  );
}
