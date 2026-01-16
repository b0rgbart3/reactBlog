import React, { useEffect, useState, useCallback, useMemo } from "react";

type Props = {
  src: string;
  onClose: () => void;
};

export function ImageModal({ src, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <img
        src={src}
        className="modalImage"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
