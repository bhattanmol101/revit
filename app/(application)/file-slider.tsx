import {
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from "@heroui/pagination";
import { cn } from "@heroui/theme";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@heroui/button";

import { ChevronIcon, CrossIcon } from "@/components/icons";

export default function FileSlider({
  files,
  onFileRemove,
}: {
  files: Blob[];
  onFileRemove: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const onChange = (page: number) => {
    setCurrentIndex(page - 1);
  };

  if (files.length == 0) {
    return <></>;
  }

  const onRemove = () => {
    let newIndex = currentIndex + 1;

    if (newIndex >= files.length - 1) {
      newIndex = currentIndex - 1;
    }

    if (newIndex < 0) {
      newIndex = 0;
    }

    onFileRemove(currentIndex);
    setCurrentIndex(newIndex);
  };

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
    <div className="relative">
      <Button
        isIconOnly
        className="absolute right-0 m-3"
        radius="full"
        size="sm"
        onPress={onRemove}
      >
        <CrossIcon size={20} />
      </Button>
      <div
        key={files.length}
        className="w-full mt-1 flex flex-col items-center"
      >
        <Image
          alt="file"
          className="rounded-lg bg-default-100 w-full h-[34em] object-contain"
          height={100}
          src={URL.createObjectURL(files[currentIndex])}
          width={100}
        />
        <Pagination
          disableCursorAnimation
          showControls
          className="mt-px"
          page={currentIndex + 1}
          radius="full"
          renderItem={renderItem}
          size="sm"
          total={files.length}
          variant="light"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
