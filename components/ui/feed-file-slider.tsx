import {
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@heroui/pagination";
import { cn } from "@heroui/theme";
import Image from "next/image";
import { useState } from "react";

import { ChevronIcon } from "@/components/icons";

export default function FeedFileSlider({ files }: { files: string[] }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const onChange = (page: number) => {
    setCurrentIndex(page - 1);
  };

  if (files.length == 0) {
    return <></>;
  }

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className="bg-default-200/50 w-4 h-4 rounded-full"
          onClick={onNext}
        >
          <ChevronIcon className="rotate-180" height={12} />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className="bg-default-200/50 w-4 h-4 rounded-full"
          onClick={onPrevious}
        >
          <ChevronIcon height={12} />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return <button key={key}>...</button>;
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          "h-2 w-2 rounded-full",
          isActive && "bg-gradient-to-br from-indigo-500 to-pink-500 font-bold",
          !isActive && "bg-default-200",
        )}
        onClick={() => setPage(value)}
      />
    );
  };

  return (
    <div className="mt-1 flex flex-col items-center relative sm:h-[36em] rounded-lg bg-default-100">
      <Image
        alt="file"
        className="w-auto sm:h-[36em] object-cover"
        height={720}
        src={files[currentIndex]}
        width={1080}
      />
      <Pagination
        disableCursorAnimation
        showControls
        className="mt-px absolute bottom-4"
        page={currentIndex + 1}
        radius="full"
        renderItem={renderItem}
        size="sm"
        total={files.length}
        variant="light"
        onChange={onChange}
      />
    </div>
  );
}
