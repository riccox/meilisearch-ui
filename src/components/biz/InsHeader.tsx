import { Link } from "@arco-design/web-react";
import { IconBook2, IconBrandGithub, IconBug } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { DashBreadcrumb } from "../common/Breadcrumb";
import { Logo } from "../common/logo";
import { LangSelector } from "../common/Lang";

export const Header = () => {
	const { t } = useTranslation("header");

	return (
		<header className="px-4 py-2 bg-white border-b border-neutral-600/20 overflow-hidden flex items-center gap-4 flex-shrink-0 flex-grow-0 basis-auto">
			<Logo className="size-8" />
			<DashBreadcrumb />
			<div className="ml-auto flex items-center gap-3">
				<Link
					href={"https://docs.meilisearch.com"}
					target={"_blank"}
					className={"!inline-flex items-center !no-underline !text-sky-500"}
					icon={<IconBook2 size={"1.5em"} />}
				>
					{t("meilisearch_docs")}
				</Link>
				<Link
					href={"https://github.com/riccox/meilisearch-ui/issues"}
					target={"_blank"}
					className={"!inline-flex items-center !no-underline !text-sky-500"}
					icon={<IconBug size={"1.5em"} />}
				>
					{t("issues")}
				</Link>
				<Link
					href={"https://github.com/riccox/meilisearch-ui"}
					target={"_blank"}
					className={"!inline-flex items-center !no-underline !text-sky-500"}
					icon={<IconBrandGithub size={"1.5em"} />}
				>
					{t("open_source")}
				</Link>
				<LangSelector className="text-small font-semibold" />
			</div>
		</header>
	);
};
