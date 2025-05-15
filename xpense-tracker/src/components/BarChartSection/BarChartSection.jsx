import styles from "./BarChartSection.module.css";
import BarChart from "../BarChart/BarChart";


export default function BarChartSection() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading}>Top Expenses</h1>
            <div className={styles.chart_box}>
                <BarChart />
            </div>
        </div>
    )
}