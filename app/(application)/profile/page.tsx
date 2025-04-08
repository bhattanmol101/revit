"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {Tabs, Tab} from "@heroui/tabs";
import { useDisclosure } from "@heroui/modal";
import React, { useEffect, useState } from "react";
import EditProfileModal from "./_component/edit-profile-modal";
import { fetchUserAction } from "@/app/action";
import { User } from "@/types/user";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Post, Review } from "@/types/post";
import { getAllUserPostAction, getAllUserReviewsAction, logoutUserAction } from "./action";
import FeedItemCard from "@/components/ui/feed-item-card";
import { getJoingDateString, getPostDateString } from "@/utils/date-utils";
import { FeedReview } from "@/components/ui/feed-review";

import { useRouter } from "next/navigation";

function ProfilePage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const [user, setUser] = useState<User>()
  const [posts, setPosts] = useState<Post[]>()
  const [reviews, setReviews] = useState<Review[]>()

  const onLogoutPress = async () => {
    setLogoutLoading(true)
    const res = await logoutUserAction();
    setLogoutLoading(false)
    if (res.success){
      router.replace("/signin")
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserAction();
      setLoading(false)
      if (user) {
        setUser(user);
        const resp = await getAllUserPostAction(user.id);
        setPostLoading(false)
        console.log(resp)
        if (resp.success) {
          setPosts(resp.posts);
        }
        const respReview = await getAllUserReviewsAction(user.id);
        setReviewLoading(false)
        console.log(respReview)
        if (respReview.success) {
          setReviews(respReview.reviews);
        }
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-5">
    {loading && <Spinner />}
    {!loading && <div className="w-full">       
      <div className="flex flex-row justify-start items-center w-full">
        <div className="basis-1/3">
          <Avatar
            className="w-36 h-36"
            showFallback
            src={String(user?.profileImage)}
          />
        </div>
        <div className="flex flex-col basis-1/2 gap-3">
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl">{user?.name}</p>
            <div className="flex flex-row items-center gap-2">
              <Button
                color="default"
                size="sm"
                spinnerPlacement="end"
                isDisabled={logoutLoading}
                onPress={onOpen}
              >
                Edit Profile
              </Button>
              <Button
                color="default"
                size="sm"
                isDisabled={logoutLoading}
                spinnerPlacement="end"
                spinner={logoutLoading}
                onPress={onLogoutPress}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center gap-5 text-default-600">
          {postLoading && <Spinner size="sm"/>}<p>{posts && posts.length } posts</p>
          {reviewLoading && <Spinner size="sm"/>}<p>{reviews && reviews.length } reviews</p>
          </div>
          <div className="flex flex-row items-center gap-5 text-default-600">
            <p>Since: {user && getJoingDateString(new Date(user.createdAt))}</p>
            {user?.dob && <p>Birthday: {getPostDateString(new Date(user.dob))}</p>}
          </div>
        </div>
      </div>
      {user?.bio && <Divider className="my-3"/>}
      <p>{user?.bio}</p>
      <Divider className="my-3"/>
      <div className="flex flex-col items-center w-full">
      <Tabs aria-label="Options">
        <Tab key="posts" title="Posts" className="w-full flex flex-col items-center">
          {postLoading ? <Spinner /> : (posts ? posts.map((post) => (
            <FeedItemCard
              key={post.id}
              post={post}
            />
          )) : <p>No posts yet...</p>)}
        </Tab>
        <Tab key="reviews" title="Reviews" className="w-full flex flex-col items-center">
          {reviewLoading ? <Spinner /> : (reviews && reviews.map((review) => (
            <FeedReview key={review.id} review={review} />
          )))}
        </Tab>
      </Tabs>
      </div>
      <EditProfileModal isOpen={isOpen} onOpenChange={onOpenChange} user={user}/>
    </div>}
    </div>
  );
}

export default ProfilePage;
