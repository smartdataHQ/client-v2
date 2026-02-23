import { useState, useCallback, useEffect, useRef } from "react";
import { useResponsive } from "ahooks";
import cn from "classnames";

import styles from "./index.module.less";

import type { FC, ReactNode } from "react";

const DEFAULT_WIDTH = 282;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

interface SidebarProps {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ icon, title, children }) => {
  const responsive = useResponsive();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startWidth: width };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(
          MIN_WIDTH,
          dragRef.current.startWidth + e.clientX - dragRef.current.startX
        )
      );
      setWidth(newWidth);
    };
    const onMouseUp = () => {
      if (dragRef.current) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
      dragRef.current = null;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!responsive.lg) {
    return (
      <div className={cn(styles.wrapper, styles.wrapperMobile)}>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    );
  }

  return (
    <div className={styles.resizableWrapper} style={{ width }}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {icon && <div className={styles.iconContainer}>{icon}</div>}
          <div>{title}</div>
        </div>
        {children && <div className={styles.body}>{children}</div>}
      </div>
      <div className={styles.resizeHandle} onMouseDown={onMouseDown} />
    </div>
  );
};

export default Sidebar;
