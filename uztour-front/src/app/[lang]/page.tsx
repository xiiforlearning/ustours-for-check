// import useStore from "@/store/useStore";
// import styles from "./page.module.css";
import Transfer from "../../components/Transfer";
import ExcursionList from "../../components/ExcursionList";
import { excursions } from "@/consts";

export default function Home() {
  return (
    <div>
      <Transfer />
      <ExcursionList
        title="Популярные экскурсии"
        data={excursions.slice(0, 6)}
      />
    </div>
  );
}
