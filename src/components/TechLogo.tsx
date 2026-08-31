import { FC } from "react";

interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechLogo: FC<TechLogoProps> = ({ name, className = "h-5 w-5", size = 20 }) => {
  const lower = name.toLowerCase();

  // Django
  if (lower.includes("django")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#092E20" />
        <path
          d="M13.8 6.5h2.2v8.5c0 2.2-1.3 3.5-3.6 3.5-1.9 0-3.1-1.1-3.5-2.3l1.9-.8c.3.7.8 1.2 1.6 1.2 1 0 1.5-.7 1.5-1.8V6.5zm-5.2 4.4v4c0 .9-.5 1.4-1.4 1.4s-1.4-.5-1.4-1.4v-4c0-.9.5-1.4 1.4-1.4s1.4.5 1.4 1.4z"
          fill="#44B78B"
        />
      </svg>
    );
  }

  // React
  if (lower.includes("react")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#1A1D24" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.6" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.6" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="3.6" ry="8.6" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    );
  }

  // Shopify / Liquid
  if (lower.includes("shopify") || lower.includes("liquid")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#172714" />
        <path
          d="M16.6 6.3c-.1-.3-.3-.4-.5-.4h-.8c-.1-.7-.6-2.2-2.3-2.2-.4 0-.8.1-1.1.3-.4-.6-1-1-1.8-1-1.5 0-2.2 1.4-2.4 2.5l-1.3.4c-.4.1-.5.3-.6.6L4.5 17.8c-.1.3.1.6.4.7l8.2 2.4c.3.1.6 0 .8-.2l5.7-4.2c.2-.2.3-.4.3-.7L16.6 6.3zm-4.4-1.5c.6 0 .9.7 1 1.4l-2.1.6c.2-.9.6-2 1.1-2zm-3.2 2.3l1.8-.5c-.1.8.2 1.9.9 2.6l-2.7.8v-2.9zm3.5 10.8l-5.6-1.6 1-9 4.6 9.6v1zm.7-1.1v-8.4l3.8-1.1 1.7 8.3-5.5 1.2z"
          fill="#95BF47"
        />
      </svg>
    );
  }

  // Python
  if (lower.includes("python")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#172133" />
        <path
          d="M11.8 4c-3.4 0-3.2 1.5-3.2 1.5l.004 1.5h3.3v.5H7s-2.1-.2-2.1 3.1 1.8 3.2 1.8 3.2h1.1v-1.6s-.1-1.8 1.8-1.8h3.2s1.7 0 1.7-1.7V6.6S14.8 4 11.8 4zm-.9 1.1c.3 0 .6.3.6.6s-.3.6-.6.6-.6-.3-.6-.6.3-.6.6-.6z"
          fill="#387EB8"
        />
        <path
          d="M12.2 20c3.4 0 3.2-1.5 3.2-1.5l-.004-1.5h-3.3v-.5H17s2.1.2 2.1-3.1-1.8-3.2-1.8-3.2h-1.1v1.6s.1 1.8-1.8 1.8H11.2s-1.7 0-1.7 1.7v1.6S9.2 20 12.2 20zm.9-1.1c-.3 0-.6-.3-.6-.6s.3-.6.6-.6.6.3.6.6-.3.6-.6.6z"
          fill="#FFE052"
        />
      </svg>
    );
  }

  // PostgreSQL / Database / SQLite / SQL
  if (
    lower.includes("postgresql") ||
    lower.includes("postgres") ||
    lower.includes("sqlite") ||
    lower.includes("sql") ||
    lower.includes("database")
  ) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#132338" />
        <path
          d="M12 4.5C8 4.5 5 5.5 5 7v10c0 1.5 3 2.5 7 2.5s7-1 7-2.5V7c0-1.5-3-2.5-7-2.5zm5 10.3c-.9.7-2.8 1.2-5 1.2s-4.1-.5-5-1.2V12.6c1.1.8 3 1.4 5 1.4s3.9-.6 5-1.4v2.2zm0-3.5c-.9.7-2.8 1.2-5 1.2s-4.1-.5-5-1.2V9.1c1.1.8 3 1.4 5 1.4s3.9-.6 5-1.4v2.2zm0-3.8C16.1 8.2 14.2 8.7 12 8.7S7.9 8.2 7 7.5C7.9 6.8 9.8 6.3 12 6.3s4.1.5 5 1.2z"
          fill="#336791"
        />
      </svg>
    );
  }

  // Tailwind CSS
  if (lower.includes("tailwind")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0C192E" />
        <path
          d="M12 8.5c-1.3 0-2.2.6-2.6 1.8.8-.5 1.6-.4 2 .1.4.4.6 1 1 1.6.6 1 1.5 2 3.1 2 1.3 0 2.2-.6 2.6-1.8-.8.5-1.6.4-2-.1-.4-.4-.6-1-1-1.6-.6-1-1.5-2-3.1-2zm-4.5 4.5c-1.3 0-2.2.6-2.6 1.8.8-.5 1.6-.4 2 .1.4.4.6 1 1 1.6.6 1 1.5 2 3.1 2 1.3 0 2.2-.6 2.6-1.8-.8.5-1.6.4-2-.1-.4-.4-.6-1-1-1.6-.6-1-1.5-2-3.1-2z"
          fill="#38BDF8"
        />
      </svg>
    );
  }

  // WordPress / WooCommerce
  if (lower.includes("wordpress") || lower.includes("woocommerce")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0E2336" />
        <circle cx="12" cy="12" r="7.5" stroke="#21759B" strokeWidth="1.5" />
        <path
          d="M6 12c0 2.8 1.8 5.2 4.3 6.1L7.2 9.7C6.4 10.3 6 11.1 6 12zm7.6-.4l1.6 4.7c1.5-1 2.5-2.6 2.5-4.4 0-.6-.1-1.2-.3-1.7-.4 1.1-.9 2.2-1.3 3.2l-1.5-4.4c.5 0 .9-.1.9-.1.3 0 .2-.5-.1-.5h-2.7c-.3 0-.4.5-.1.5 0 0 .5.1.9.1l1.4 3.7-1.3 3.9-2.3-6.8c.4 0 .8-.1.8-.1.3 0 .2-.5-.1-.5H9.6c-.3 0-.4.5-.1.5 0 0 .4.1.8.1l2.8 7.6 2.5-7.6z"
          fill="#38B2E3"
        />
      </svg>
    );
  }

  // Wix / Velo
  if (lower.includes("wix") || lower.includes("velo")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#000000" />
        <path
          d="M6 8l1.8 8h1.6L11 11.5 12.6 16h1.6L16 8h-1.6l-1 5.3L11.8 8h-1.6l-1.6 5.3L7.6 8H6z"
          fill="#FAFAFA"
        />
      </svg>
    );
  }

  // Speed / Core Web Vitals / Performance / Lighthouse
  if (
    lower.includes("speed") ||
    lower.includes("vital") ||
    lower.includes("performance") ||
    lower.includes("lighthouse")
  ) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0C261D" />
        <circle cx="12" cy="12" r="7.5" stroke="#10B981" strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2.2" fill="#10B981" />
      </svg>
    );
  }

  // Git / GitHub / Version Control
  if (lower.includes("git") || lower.includes("github")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#2E1B15" />
        <path
          d="M17.8 11.2l-5-5a1.1 1.1 0 00-1.6 0l-5 5a1.1 1.1 0 000 1.6l5 5c.4.4 1.1.4 1.6 0l5-5c.4-.5.4-1.2 0-1.6zm-5.8 4.6v-2.2a2.3 2.3 0 011-1.9l1.6-1a1.2 1.2 0 10-.6-1.1l-1.8 1.1a3.4 3.4 0 00-1.7 3v2.1a1.5 1.5 0 101.5 0z"
          fill="#F05032"
        />
      </svg>
    );
  }

  // REST API / DRF / Postman / Endpoints
  if (lower.includes("api") || lower.includes("drf") || lower.includes("rest") || lower.includes("postman")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#2B1D11" />
        <path
          d="M7 12h10M13 8l4 4-4 4M11 16l-4-4 4-4"
          stroke="#FF6C37"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // JavaScript / TypeScript
  if (lower.includes("javascript") || lower.includes("js") || lower.includes("typescript") || lower.includes("ts")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#2B2810" />
        <path d="M7 8h10v2.5H13v7.5h-2V10.5H7V8z" fill="#F7DF1E" />
      </svg>
    );
  }

  // GraphQL / Webhooks
  if (lower.includes("graphql") || lower.includes("webhook")) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#291226" />
        <circle cx="12" cy="7" r="2" fill="#E535AB" />
        <circle cx="6.5" cy="16.5" r="2" fill="#E535AB" />
        <circle cx="17.5" cy="16.5" r="2" fill="#E535AB" />
        <path d="M12 7l-5.5 9.5M12 7l5.5 9.5M6.5 16.5h11" stroke="#E535AB" strokeWidth="1.4" />
      </svg>
    );
  }

  // Default Code / Terminal Icon
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#14212D" />
      <path
        d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 7l-2 10"
        stroke="#10B981"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
