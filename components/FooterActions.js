import React from "react";
import Link from "next/link";
import styles from "../pages/VerifyphotoFoot/verphoto.module.css";

export default function FooterActions({ onConfirm, retakePath }) {
  return (
    <footer className={styles.footer}>
      <Link href={retakePath}>
        <button className={styles.retakeBtn}>ถ่ายใหม่อีกครั้ง</button>
      </Link>
      <button className={styles.confirmBtn} onClick={onConfirm}>
        ยืนยัน
      </button>
    </footer>
  );
}
