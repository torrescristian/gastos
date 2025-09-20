import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ChevronDownIcon,
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../../contexts/language-context";
import { cn } from "../../lib/utils";

const languages = [
  { code: "es", name: "ES", flag: "🇦🇷" },
  { code: "en", name: "EN", flag: "🇺🇸" },
] as const;

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300/20 hover:bg-white/20 transition-colors">
          <GlobeAltIcon className="h-4 w-4" aria-hidden="true" />
          {currentLanguage.name}
          <ChevronDownIcon className="-mr-1 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      active ? "bg-gray-100" : "",
                      language === lang.code
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700",
                      "group flex w-full items-center px-4 py-2 text-sm transition-colors"
                    )}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.name}</span>
                    {language === lang.code && (
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
