import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadCrumb = ({ breadCrumbData = [] }) => {
  if (!breadCrumbData.length) return null; // prevent rendering empty breadcrumbs

  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        {breadCrumbData.map((item, index) => {
          const isLast = index === breadCrumbData.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
