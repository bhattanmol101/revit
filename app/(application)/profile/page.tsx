"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { useDisclosure } from "@heroui/modal";
import React, { useEffect, useState } from "react";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";

import EditProfileModal from "./_components/edit-profile-modal";
import {
  getAllUserPostAction,
  getAllUserReviewsAction,
  logoutUserAction,
} from "./action";

import { fetchUserAction } from "@/app/action";
import { User } from "@/types/user";
import { Post, Review } from "@/types/post";
import FeedItemCard from "@/components/ui/feed-item-card";
import { getJoingDateString, getPostDateString } from "@/utils/date-utils";
import { FeedReview } from "@/components/ui/feed-review";
import { EditIcon, LogoutIcon } from "@/components/icons";

function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>();
  const [reviews, setReviews] = useState<Review[]>();

  const onLogoutPress = async () => {
    setLogoutLoading(true);
    const res = await logoutUserAction();

    setLogoutLoading(false);
    if (res.success) {
      router.replace("/signin");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserAction();

      setLoading(false);
      if (user) {
        setUser(user);
        const resp = await getAllUserPostAction(user.id);

        setPostLoading(false);
        if (resp.success) {
          setPosts(resp.posts);
        }
        const respReview = await getAllUserReviewsAction(user.id);

        setReviewLoading(false);
        if (respReview.success) {
          setReviews(respReview.reviews);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center sm:w-full w-screen sm:py-5 py-3 px-2">
      {loading && <Spinner />}
      {!loading && (
        <div className="w-full">
          <div className="flex flex-row justify-start items-center w-full px-1">
            <div className="sm:basis-1/3 ">
              <Avatar
                showFallback
                className="sm:w-36 sm:h-36 h-24 w-24"
                src={String(user?.profileImage)}
              />
            </div>
            <div className="flex flex-col sm:basis-1/2 w-full sm:gap-3 gap-1 px-3 sm:px-0">
              <div className="flex flex-row items-center justify-between flex-wrap">
                <p className="sm:text-xl font-bold mr-2">{user?.name}</p>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    isIconOnly
                    color="default"
                    isDisabled={logoutLoading}
                    size="sm"
                    spinnerPlacement="end"
                    onPress={onOpen}
                  >
                    <EditIcon size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    isDisabled={logoutLoading}
                    isLoading={logoutLoading}
                    size="sm"
                    spinnerPlacement="end"
                    onPress={onLogoutPress}
                  >
                    <LogoutIcon size={20} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-row items-center gap-5 text-default-600">
                {postLoading && <Spinner size="sm" />}
                <p className="sm:text-base text-sm">
                  {posts && posts.length} posts
                </p>
                {reviewLoading && <Spinner size="sm" />}
                <p className="sm:text-base text-sm">
                  {reviews && reviews.length} reviews
                </p>
              </div>
              <div className="flex sm:flex-row flex-col sm:items-center items-start sm:gap-5 gap-1 text-default-600">
                <p className="sm:text-base text-sm">
                  Since: {user && getJoingDateString(new Date(user.createdAt))}
                </p>
                {user?.dob && (
                  <p className="sm:text-base text-sm">
                    Birthday: {getPostDateString(new Date(user?.dob))}
                  </p>
                )}
              </div>
            </div>
          </div>
          {user?.bio && <Divider className="my-3" />}
          <p className="sm:text-base text-sm">{user?.bio}</p>
          <Divider className="my-3" />
          <div className="flex flex-col items-center w-full">
            <Tabs aria-label="Options">
              <Tab
                key="posts"
                className="w-full flex flex-col items-center"
                title="Posts"
              >
                {postLoading ? (
                  <Spinner />
                ) : posts ? (
                  posts.map((post) => (
                    <FeedItemCard key={post.id} post={post} />
                  ))
                ) : (
                  <p>No posts yet...</p>
                )}
              </Tab>
              <Tab
                key="reviews"
                className="w-full flex flex-col items-center"
                title="Reviews"
              >
                {reviewLoading ? (
                  <Spinner />
                ) : (
                  reviews &&
                  reviews.map((review) => (
                    <FeedReview key={review.id} review={review} />
                  ))
                )}
              </Tab>
            </Tabs>
          </div>
          <EditProfileModal
            isOpen={isOpen}
            user={user}
            onOpenChange={onOpenChange}
          />
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
