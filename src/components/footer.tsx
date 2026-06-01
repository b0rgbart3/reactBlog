'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

export function Footer() {
  const router = useRouter();

  const copyrightInfo = useCallback(() => {
    router.push('/about');
  }, [router]);

  return (
    <div className='footerContainer'>
      <div className="divider" />
      <div className='footer'>
        <p onClick={copyrightInfo}>Moon-Math @copyright 2026 Bart Dority - see full rights disclaimer</p>
      </div>
    </div>
  );
}
