import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { SITE_NAV } from "@/config/siteNav";

function isActivePage(currentPageName, item) {
  if (!item.page) return false;
  if (item.page === "Home") return currentPageName === "Home" || !currentPageName;
  return currentPageName === item.page;
}

function NavLinkStyle({ active, className, children, ...props }) {
  return (
    <Link
      {...props}
      className={className}
      style={{
        color: active ? "#a78bfa" : "#64748b",
        background: active ? "rgba(167,139,250,0.1)" : "transparent",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </Link>
  );
}

function DesktopDropdown({ item, currentPageName, open, onOpen, onClose, onMouseLeave }) {
  const active = isActivePage(currentPageName, item);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const categories = item.mega ? item.children.filter((c) => c.children?.length) : [];
  const topLinks = item.mega ? item.children.filter((c) => !c.children?.length) : item.children || [];

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onMouseLeave || onClose}
    >
      <Link
        to={item.to}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        style={{
          color: active || open ? "#a78bfa" : "#64748b",
          background: active || open ? "rgba(167,139,250,0.1)" : "transparent",
          fontFamily: "'Inter', sans-serif",
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.name}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>

      {open ? (
        <div
          ref={panelRef}
          className={`absolute top-full pt-2 z-50 ${item.mega ? "left-1/2 -translate-x-1/2" : "left-0"}`}
        >
          <div
            className={item.mega ? "rounded-2xl p-5 w-[min(70rem,calc(100vw-2rem))]" : "rounded-2xl py-2 min-w-[16rem]"}
            style={{
              background: "rgba(8,15,32,0.98)",
              border: "1px solid rgba(167,139,250,0.28)",
              boxShadow: "0 22px 50px rgba(0,0,0,0.5)",
            }}
          >
            {topLinks.length > 0 ? (
              <div className={item.mega ? "mb-4" : ""}>
                {topLinks.map((link) => (
                  <Link
                    key={link.to + link.name}
                    to={link.to}
                    onClick={onClose}
                    className="block px-4 py-2 text-sm rounded-lg hover:bg-white/5"
                    style={{ color: "#e2e8f0" }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ) : null}

            {item.mega ? (
              <div className="grid grid-cols-4 gap-5">
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <Link
                      to={cat.to}
                      onClick={onClose}
                      className="block text-xs font-semibold uppercase tracking-widest mb-2 hover:text-white"
                      style={{ color: "#a78bfa" }}
                    >
                      {cat.name}
                    </Link>
                    <ul className="space-y-0.5">
                      {cat.children.map((course) => (
                        <li key={course.to}>
                          <Link
                            to={course.to}
                            onClick={onClose}
                            className="block px-0 py-1.5 text-sm rounded-md hover:text-white"
                            style={{ color: "#94a3b8" }}
                          >
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DesktopSiteNav({ currentPageName }) {
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimer = useRef(null);

  const open = (name) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const closeNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  return (
    <div className="hidden lg:flex items-center gap-0.5">
      {SITE_NAV.map((item) =>
        item.children ? (
          <DesktopDropdown
            key={item.name}
            item={item}
            currentPageName={currentPageName}
            open={openMenu === item.name}
            onOpen={() => open(item.name)}
            onClose={closeNow}
            onMouseLeave={closeSoon}
          />
        ) : (
          <NavLinkStyle
            key={item.name}
            to={item.to}
            active={isActivePage(currentPageName, item)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            {item.name}
          </NavLinkStyle>
        )
      )}
    </div>
  );
}

function MobileBranch({ item, currentPageName, onNavigate }) {
  const [open, setOpen] = useState(false);
  const active = isActivePage(currentPageName, item);

  if (!item.children) {
    return (
      <Link
        to={item.to}
        onClick={onNavigate}
        className="flex items-center px-4 min-h-12 rounded-xl text-sm font-medium"
        style={{
          color: active ? "#a78bfa" : "#94a3b8",
          background: active ? "rgba(167,139,250,0.1)" : "transparent",
        }}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          to={item.to}
          onClick={onNavigate}
          className="flex-1 flex items-center px-4 min-h-12 rounded-xl text-sm font-medium"
          style={{
            color: active ? "#a78bfa" : "#94a3b8",
            background: active ? "rgba(167,139,250,0.1)" : "transparent",
          }}
        >
          {item.name}
        </Link>
        <button
          type="button"
          aria-label={`${open ? "Collapse" : "Expand"} ${item.name}`}
          aria-expanded={open}
          className="w-12 h-12 flex items-center justify-center rounded-xl"
          style={{ color: "#94a3b8" }}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open ? (
        <div className="pl-3 pb-2 space-y-1">
          {item.children.map((child) => (
            <div key={child.name}>
              <Link
                to={child.to}
                onClick={onNavigate}
                className="block px-4 py-2.5 rounded-lg text-sm"
                style={{ color: child.children ? "#c4b5fd" : "#94a3b8" }}
              >
                {child.name}
              </Link>
              {child.children?.length ? (
                <div className="pl-3">
                  {child.children.map((leaf) => (
                    <Link
                      key={leaf.to}
                      to={leaf.to}
                      onClick={onNavigate}
                      className="block px-4 py-2 rounded-lg text-xs"
                      style={{ color: "#64748b" }}
                    >
                      {leaf.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MobileSiteNav({ currentPageName, onNavigate }) {
  return (
    <div className="space-y-1">
      {SITE_NAV.map((item) => (
        <MobileBranch
          key={item.name}
          item={item}
          currentPageName={currentPageName}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
