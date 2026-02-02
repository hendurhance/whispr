import {
    LayoutDashboard,
    Link as LinkIcon,
    Settings,
    Inbox,
    HelpCircle,
    Mail,
    Github,
    Twitter,
    MessageCircle,
    LucideIcon
} from 'lucide-react';

// Define Types
export interface LinkData {
    text: string;
    href: string;
    external?: boolean;
}

export interface FooterColumnData {
    title: string;
    content?: string;
    links?: LinkData[];
}

export interface SocialLinkData {
    icon: LucideIcon;
    href: string;
    label: string;
}

export interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
    requiresAuth?: boolean;
    badgeKey?: string; // To identify which item should have the badge (e.g., 'unreadCount')
}

export interface SupportLink {
    label: string;
    href: string;
    icon: LucideIcon;
    external?: boolean;
}

/**
 * Hook for accessing links across the application
 */
const useLinks = () => {
    // Footer columns data
    const footerColumns: FooterColumnData[] = [
        {
            title: "Whispr",
            content: "An open-source platform for anonymous messaging, built with privacy and security in mind."
        },
        {
            title: "Links",
            links: [
                { text: "Features", href: "/#features" },
                { text: "How It Works", href: "/#how-it-works" },
                { text: "Privacy", href: "/#privacy" },
                { text: "FAQ", href: "/#faq" },
                { text: "Contact", href: "/#contact" }
            ]
        },
        {
            title: "Community",
            links: [
                { text: "GitHub Repo", href: "https://github.com/hendurhance/whispr", external: true },
                { text: "Report a Bug", href: "https://github.com/hendurhance/whispr/issues", external: true },
                { text: "Contact Us", href: "mailto:support@trywhispr.me", external: true }
            ]
        },
        {
            title: "Legal",
            links: [
                { text: "Terms of Use", href: "/terms" },
                { text: "Privacy Policy", href: "/privacy" }
            ]
        }
    ];
    
    // Social links data
    const socialLinks: SocialLinkData[] = [
        { icon: Github, href: "https://github.com/hendurhance/whispr", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com/trywhispr", label: "Twitter" },
        { icon: MessageCircle, href: "https://discord.gg/trywhispr", label: "Discord" }
    ];

    // Simple footer links
    const simpleFooterLinks: LinkData[] = [
        { text: "Terms", href: "/terms" },
        { text: "Privacy", href: "/privacy" },
        { text: "GitHub", href: "https://github.com/hendurhance/whispr", external: true }
    ];

    // Landing page header navigation links
    const landingNavLinks: LinkData[] = [
        { text: "Features", href: "#features" },
        { text: "How It Works", href: "#how-it-works" },
        { text: "Privacy", href: "#privacy" },
        { text: "FAQ", href: "#faq" },
        { text: "Contact", href: "#contact" }
    ];

    // Dashboard navigation items (for sidebar and mobile tabs)
    const dashboardNavItems: NavItem[] = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            badgeKey: 'unreadCount'
        },
        {
            label: 'My Link',
            path: '/profile',
            icon: LinkIcon
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: Settings
        }
    ];

    // Mobile navigation tabs (a subset of dashboardNavItems with different icon for Dashboard)
    const mobileNavItems: NavItem[] = [
        {
            label: 'Whisprs',
            path: '/dashboard',
            icon: Inbox,
            badgeKey: 'unreadCount'
        },
        {
            label: 'My Link',
            path: '/profile',
            icon: LinkIcon
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: Settings
        }
    ];

    // Support links for sidebar
    const supportLinks: SupportLink[] = [
        {
            label: 'Help Center',
            href: 'https://help.trywhispr.me',
            icon: HelpCircle,
            external: true
        },
        {
            label: 'Contact Support',
            href: 'mailto:support@trywhispr.me',
            icon: Mail,
            external: true
        }
    ];

    // Contact information
    const contactInfo = {
        email: 'support@trywhispr.me',
        helpCenter: 'https://help.trywhispr.me',
        github: 'https://github.com/hendurhance/whispr'
    };

    return {
        footerColumns,
        socialLinks,
        simpleFooterLinks,
        landingNavLinks,
        dashboardNavItems,
        mobileNavItems,
        supportLinks,
        contactInfo
    };
};

export default useLinks;