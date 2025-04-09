import * as React from "react";

import { IconSvgProps } from "@/types";

export const GoogleIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="-3 0 262 262"
      width={size || width}
      {...props}
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
};

export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 32 32"
    width={size || width}
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const HomeIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      fill="#fff"
      height={size || height}
      transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
      viewBox="-49.54 -49.54 594.48 594.48"
      width={size || width}
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <g>
          <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z" />{" "}
          <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z" />{" "}
        </g>
      </g>
    </svg>
  );
};

export const NotificationIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path
          clipRule="evenodd"
          d="M14.802 19.8317C15.4184 19.7699 15.8349 20.4242 15.5437 20.9539C15.3385 21.3271 15.0493 21.6529 14.7029 21.9197C14.3496 22.1918 13.9397 22.4006 13.5 22.5408C13.0601 22.6812 12.593 22.7522 12.1242 22.7522C11.6554 22.7522 11.1883 22.6812 10.7484 22.5408C10.3087 22.4006 9.89883 22.1918 9.54556 21.9197C9.1991 21.6529 8.90988 21.3271 8.70472 20.9539C8.41354 20.4242 8.83002 19.7699 9.44644 19.8317C9.63869 19.851 11.1433 19.9981 12.1242 19.9981C13.1051 19.9981 14.6097 19.851 14.802 19.8317Z"
          fill="#fff"
          fillRule="evenodd"
          id="vector (Stroke)"
        />
        <path
          clipRule="evenodd"
          d="M8.52901 2.08755C10.7932 1.00445 13.4465 0.967602 15.7423 1.98737L15.9475 2.07851C18.3532 3.14707 19.8934 5.4622 19.8934 8.0096L19.8934 9.27297C19.8934 10.2885 20.1236 11.2918 20.5681 12.213L20.8335 12.7632C22.0525 15.29 20.465 18.2435 17.6156 18.7498L17.455 18.7783C13.93 19.4046 10.3154 19.4046 6.79044 18.7783C3.90274 18.2653 2.37502 15.1943 3.77239 12.7115L3.99943 12.3082C4.55987 11.3124 4.85335 10.1981 4.85335 9.06596L4.85335 7.79233C4.85335 5.3744 6.27704 3.16478 8.52901 2.08755Z"
          fill="#fff"
          fillRule="evenodd"
          id="vector (Stroke)_2"
        />
      </g>
    </svg>
  );
};

export const ChatIcon: React.FC<IconSvgProps> = ({
  size = 23,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g id="SVGRepo_iconCarrier">
        <path
          clipRule="evenodd"
          d="M13.6288 20.4718L13.0867 21.3877C12.6035 22.204 11.3965 22.204 10.9133 21.3877L10.3712 20.4718C9.95073 19.7614 9.74049 19.4063 9.40279 19.2098C9.06509 19.0134 8.63992 19.0061 7.78958 18.9915C6.53422 18.9698 5.74689 18.8929 5.08658 18.6194C3.86144 18.1119 2.88807 17.1386 2.3806 15.9134C2 14.9946 2 13.8297 2 11.5V10.5C2 7.22657 2 5.58985 2.7368 4.38751C3.14908 3.71473 3.71473 3.14908 4.38751 2.7368C5.58985 2 7.22657 2 10.5 2H13.5C16.7734 2 18.4101 2 19.6125 2.7368C20.2853 3.14908 20.8509 3.71473 21.2632 4.38751C22 5.58985 22 7.22657 22 10.5V11.5C22 13.8297 22 14.9946 21.6194 15.9134C21.1119 17.1386 20.1386 18.1119 18.9134 18.6194C18.2531 18.8929 17.4658 18.9698 16.2104 18.9915C15.36 19.0061 14.9349 19.0134 14.5972 19.2098C14.2595 19.4062 14.0492 19.7614 13.6288 20.4718ZM8 11.75C7.58579 11.75 7.25 12.0858 7.25 12.5C7.25 12.9142 7.58579 13.25 8 13.25H13.5C13.9142 13.25 14.25 12.9142 14.25 12.5C14.25 12.0858 13.9142 11.75 13.5 11.75H8ZM7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H16C16.4142 8.25 16.75 8.58579 16.75 9C16.75 9.41421 16.4142 9.75 16 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9Z"
          fill="#fff"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export const RevitIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M9.96271 5.71911L10.241 6.41556H10.241L9.96271 5.71911ZM11.0504 4.58735L11.7543 4.84624L11.7543 4.84624L11.0504 4.58735ZM9.11472 9.25915L9.59887 8.68634L9.11472 9.25915ZM9.60971 5.86016L9.33141 5.16371L9.33141 5.16371L9.60971 5.86016ZM10.1247 10.9441L9.37607 10.9901V10.9901L10.1247 10.9441ZM9.41074 9.50935L8.9266 10.0822L9.41074 9.50935ZM9.99166 10.1089L9.32019 10.443L9.99166 10.1089ZM13.1191 12.9129L13.5352 13.5369L13.1191 12.9129ZM10.1488 11.3373L10.8974 11.2914L10.1488 11.3373ZM14.9658 12.456L15.1661 11.7333L15.1661 11.7333L14.9658 12.456ZM13.4369 12.701L13.0208 12.0771L13.4369 12.701ZM17.6644 10.1328L18.39 9.94309L18.39 9.94309L17.6644 10.1328ZM15.3337 12.558L15.1333 13.2807L15.1333 13.2807L15.3337 12.558ZM17.7958 8.16544L17.1571 7.77234L17.1571 7.77234L17.7958 8.16544ZM17.5648 9.75163L16.8392 9.94131L16.8392 9.94131L17.5648 9.75163ZM16.4692 4.76076L16.4225 5.50931L16.4692 4.76076ZM17.999 7.83522L18.6377 8.22833L18.6377 8.22833L17.999 7.83522ZM14.7037 4.00181L15.2917 3.53627V3.53627L14.7037 4.00181ZM16.0898 4.73708L16.1366 3.98854L16.0898 4.73708ZM14.4614 3.69574L13.8734 4.16128L13.8734 4.16128L14.4614 3.69574ZM11.1852 4.22083L10.4813 3.96194L10.4813 3.96194L11.1852 4.22083ZM7.88923 7.84613C8.22356 7.60159 8.29634 7.13232 8.0518 6.798C7.80726 6.46368 7.338 6.39089 7.00367 6.63543L7.88923 7.84613ZM4.24844 18L3.50784 18.1184C3.56226 18.4588 3.84172 18.7183 4.18523 18.7473C4.52874 18.7764 4.84781 18.5675 4.95863 18.2411L4.24844 18ZM10.5305 13.4386C10.923 13.3062 11.1339 12.8807 11.0015 12.4882C10.8691 12.0957 10.4436 11.8848 10.0511 12.0172L10.5305 13.4386ZM13.8734 4.16128L14.1157 4.46735L15.2917 3.53627L15.0494 3.23019L13.8734 4.16128ZM16.0431 5.48563L16.4225 5.50931L16.5159 4.01222L16.1366 3.98854L16.0431 5.48563ZM17.3603 7.44212L17.1571 7.77234L18.4345 8.55855L18.6377 8.22833L17.3603 7.44212ZM16.8392 9.94131L16.9388 10.3225L18.39 9.94309L18.2904 9.56194L16.8392 9.94131ZM15.534 11.8352L15.1661 11.7333L14.7654 13.1787L15.1333 13.2807L15.534 11.8352ZM13.0208 12.0771L12.703 12.2889L13.5352 13.5369L13.853 13.325L13.0208 12.0771ZM10.8974 11.2914L10.8732 10.8981L9.37607 10.9901L9.40023 11.3833L10.8974 11.2914ZM9.89489 8.93655L9.59887 8.68634L8.63058 9.83195L8.9266 10.0822L9.89489 8.93655ZM9.888 6.55662L10.241 6.41556L9.68441 5.02265L9.33141 5.16371L9.888 6.55662ZM11.7543 4.84624L11.8891 4.47972L10.4813 3.96194L10.3465 4.32846L11.7543 4.84624ZM10.241 6.41556C10.5675 6.28512 10.947 6.15011 11.227 5.85866L10.1455 4.81927C10.1536 4.81085 10.15 4.82124 10.0819 4.85519C10.0013 4.8954 9.88939 4.94075 9.68441 5.02265L10.241 6.41556ZM10.3465 4.32846C10.2685 4.54051 10.2242 4.65924 10.1846 4.74542C10.1502 4.82031 10.1382 4.82685 10.1455 4.81927L11.227 5.85866C11.5036 5.5709 11.6292 5.18619 11.7543 4.84624L10.3465 4.32846ZM9.59887 8.68634C9.00778 8.18674 8.63067 7.86544 8.40008 7.6042C8.29024 7.47974 8.24641 7.40409 8.22983 7.36539C8.22269 7.34872 8.22231 7.34277 8.22267 7.34522C8.22312 7.34837 8.22287 7.35152 8.2229 7.35132L6.73856 7.13516C6.64963 7.74583 6.94834 8.22615 7.27548 8.5968C7.59642 8.96042 8.07746 9.36445 8.63058 9.83195L9.59887 8.68634ZM9.33141 5.16371C8.67334 5.42666 8.09654 5.65486 7.68381 5.89794C7.25888 6.14821 6.82855 6.51718 6.73856 7.13516L8.2229 7.35132C8.22293 7.3511 8.22208 7.35556 8.21962 7.36084C8.2174 7.36558 8.21768 7.36281 8.22689 7.35202C8.24918 7.32588 8.30755 7.2714 8.44504 7.19043C8.7351 7.01959 9.18163 6.83888 9.888 6.55662L9.33141 5.16371ZM10.8732 10.8981C10.8506 10.5292 10.84 10.1301 10.6631 9.77476L9.32019 10.443C9.32027 10.4432 9.32208 10.4464 9.32521 10.4577C9.32882 10.4708 9.3343 10.4949 9.34031 10.5381C9.3537 10.6343 9.36212 10.763 9.37607 10.9901L10.8732 10.8981ZM8.9266 10.0822C9.09792 10.227 9.19324 10.3082 9.26021 10.3746C9.29002 10.4042 9.30506 10.422 9.31253 10.4317C9.3189 10.44 9.32014 10.4429 9.32019 10.443L10.6631 9.77476C10.485 9.41673 10.1721 9.17086 9.89489 8.93655L8.9266 10.0822ZM12.703 12.2889C12.0671 12.713 11.663 12.9799 11.3586 13.1218C11.0629 13.2598 11.0671 13.1812 11.1343 13.2169L10.4314 14.542C10.9926 14.8397 11.5508 14.6874 11.9926 14.4813C12.4258 14.2792 12.9429 13.9319 13.5352 13.5369L12.703 12.2889ZM9.40023 11.3833C9.44542 12.119 9.48255 12.7537 9.58106 13.2316C9.67996 13.7113 9.88187 14.2505 10.4314 14.542L11.1343 13.2169C11.1899 13.2463 11.1214 13.2744 11.0502 12.9287C10.9785 12.581 10.9456 12.0757 10.8974 11.2914L9.40023 11.3833ZM15.1661 11.7333C14.8282 11.6396 14.4402 11.5155 14.0413 11.5794L14.2787 13.0605C14.2632 13.063 14.2702 13.0563 14.3458 13.0707C14.4345 13.0876 14.5518 13.1195 14.7654 13.1788L15.1661 11.7333ZM13.853 13.325C14.0374 13.202 14.1389 13.135 14.218 13.0912C14.2854 13.0539 14.2941 13.058 14.2787 13.0605L14.0413 11.5794C13.6425 11.6433 13.3126 11.8825 13.0208 12.0771L13.853 13.325ZM16.9388 10.3225C17.1375 11.0827 17.2638 11.573 17.3041 11.9257C17.3441 12.2764 17.2705 12.2714 17.3138 12.2263L18.3953 13.2657C18.8262 12.8173 18.85 12.2423 18.7944 11.7555C18.739 11.2708 18.5764 10.6562 18.39 9.94309L16.9388 10.3225ZM15.1333 13.2807C15.8192 13.4709 16.4187 13.6393 16.8933 13.6958C17.3776 13.7535 17.9552 13.7237 18.3953 13.2657L17.3138 12.2263C17.3663 12.1717 17.3945 12.2449 17.0708 12.2063C16.7374 12.1666 16.2704 12.0394 15.534 11.8352L15.1333 13.2807ZM17.1571 7.77234C16.9667 8.08164 16.7462 8.41285 16.6886 8.80849L18.1729 9.02465C18.173 9.02449 18.1733 9.02135 18.1767 9.01143C18.1808 8.99982 18.1896 8.97813 18.2087 8.94072C18.2516 8.85669 18.3169 8.74965 18.4345 8.55855L17.1571 7.77234ZM18.2904 9.56194C18.2329 9.34181 18.2008 9.217 18.1835 9.12138C18.1757 9.07848 18.1734 9.05383 18.1728 9.0403C18.1722 9.02856 18.1729 9.02487 18.1729 9.02465L16.6886 8.80849C16.6314 9.20129 16.7457 9.58377 16.8392 9.94131L18.2904 9.56194ZM16.4225 5.50931C17.1815 5.55669 17.6621 5.58882 17.9908 5.66046C18.1467 5.69441 18.219 5.72789 18.2482 5.74569C18.2603 5.75303 18.2613 5.75552 18.2577 5.75164C18.2536 5.74734 18.2514 5.74331 18.2515 5.74346L19.5944 5.07523C19.3161 4.51595 18.7919 4.29981 18.3102 4.19484C17.8422 4.09288 17.2231 4.05637 16.5159 4.01222L16.4225 5.50931ZM18.6377 8.22833C19.0175 7.61129 19.3485 7.07716 19.54 6.63148C19.7352 6.1773 19.8693 5.6277 19.5944 5.07523L18.2515 5.74346C18.2515 5.7436 18.2503 5.74066 18.2498 5.73752C18.2493 5.73508 18.2508 5.74087 18.2493 5.75898C18.2456 5.80099 18.2275 5.88664 18.1619 6.03926C18.0242 6.35959 17.7661 6.78276 17.3603 7.44212L18.6377 8.22833ZM14.1157 4.46735C14.3404 4.75118 14.5798 5.07758 14.9325 5.26464L15.6354 3.93953C15.6448 3.94452 15.6315 3.94211 15.5754 3.88177C15.511 3.8123 15.4319 3.71336 15.2917 3.53627L14.1157 4.46735ZM16.1366 3.98854C15.9163 3.97479 15.7959 3.96668 15.7068 3.95368C15.6316 3.94271 15.6249 3.93399 15.6354 3.93953L14.9325 5.26464C15.2896 5.45408 15.6924 5.46373 16.0431 5.48563L16.1366 3.98854ZM15.0494 3.23019C14.5967 2.65836 14.2058 2.16142 13.8539 1.82987C13.5009 1.49722 13.0186 1.16762 12.3929 1.2679L12.6303 2.749C12.5494 2.76196 12.5736 2.68446 12.8252 2.92151C13.0779 3.15967 13.3894 3.55003 13.8734 4.16128L15.0494 3.23019ZM11.8891 4.47972C12.1583 3.74779 12.3326 3.27949 12.4985 2.97418C12.6636 2.67022 12.711 2.73606 12.6303 2.749L12.3929 1.2679C11.7674 1.36816 11.412 1.83184 11.1805 2.25806C10.9496 2.68293 10.7331 3.27716 10.4813 3.96194L11.8891 4.47972ZM7.00367 6.63543C4.39707 8.54203 2.54807 12.1145 3.50784 18.1184L4.98903 17.8816C4.09936 12.3163 5.82582 9.35541 7.88923 7.84613L7.00367 6.63543ZM4.95863 18.2411C5.67516 16.1304 7.90185 14.3251 10.5305 13.4386L10.0511 12.0172C7.16706 12.9899 4.45886 15.047 3.53824 17.7589L4.95863 18.2411Z"
        fill="#71717A"
      />
      <path
        d="M10.2808 16C10.2808 16 10.9135 17.3908 11.6935 17.8692C12.4735 18.3475 14 18.2808 14 18.2808C14 18.2808 12.6092 18.9135 12.1308 19.6935C11.6525 20.4735 11.7192 22 11.7192 22C11.7192 22 11.0865 20.6092 10.3065 20.1308C9.52652 19.6525 8 19.7192 8 19.7192C8 19.7192 9.39082 19.0865 9.86916 18.3065C10.3475 17.5265 10.2808 16 10.2808 16Z"
        stroke="#71717A"
        strokeLinejoin="round"
      />
      <path
        d="M18.4795 15C18.4795 15 18.0577 15.9272 17.5377 16.2461C17.0177 16.565 16 16.5205 16 16.5205C16 16.5205 16.9272 16.9423 17.2461 17.4623C17.565 17.9823 17.5205 19 17.5205 19C17.5205 19 17.9423 18.0728 18.4623 17.7539C18.9823 17.435 20 17.4795 20 17.4795C20 17.4795 19.0728 17.0577 18.7539 16.5377C18.435 16.0177 18.4795 15 18.4795 15Z"
        stroke="#71717A"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const MenuIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    stroke="#fff"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </g>
  </svg>
);

export const ImageIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        clipRule="evenodd"
        d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
        fill="#fff"
        fillRule="evenodd"
      />
      <path
        d="M4.80665 17.5211L9.1221 9.60947C9.50112 8.91461 10.4989 8.91461 10.8779 9.60947L14.0465 15.4186L15.1318 13.5194C15.5157 12.8476 16.4843 12.8476 16.8682 13.5194L19.1451 17.5039C19.526 18.1705 19.0446 19 18.2768 19H5.68454C4.92548 19 4.44317 18.1875 4.80665 17.5211Z"
        fill="#fff"
      />
      <path
        d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z"
        fill="#fff"
      />
    </g>
  </svg>
);

export const VideoIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </g>
  </svg>
);

export const SearchIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const CrossIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    stroke="#fff"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
        fill="#fff"
      />
    </g>
  </svg>
);

export const ProfileIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    stroke="#fff"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <g id="style=fill">
        <g id="profile">
          <path
            clipRule="evenodd"
            d="M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z"
            fill="#ffffff"
            fillRule="evenodd"
            id="vector (Stroke)"
          />
          <path
            clipRule="evenodd"
            d="M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z"
            fill="#ffffff"
            fillRule="evenodd"
            id="rec (Stroke)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const EditIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    stroke="#fff"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <title />
      <g id="Complete">
        <g id="edit">
          <g>
            <path
              d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <polygon
              fill="none"
              points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const LogoutIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    stroke="#fff"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z"
        fill="#fff"
      />
      <path
        d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z"
        fill="#fff"
      />
    </g>
  </svg>
);
