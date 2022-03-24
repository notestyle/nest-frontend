import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

const Home = () => {
  const [profile, setProfile] = useState();
  const [title, setTitle] = useState();
  const [message, setMessage] = useState();
  const [image, setImage] = useState();
  const [news, setNews] = useState([]);

  const router = useRouter();

  function getBase64(file) {
    return new Promise((res, rej) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        res(reader.result);
      };
      reader.onerror = function (error) {
        rej(error);
      };
    });
  }

  async function postNews() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        title,
        message,
        image: await getBase64(image),
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      }),
    };

    fetch("http://localhost:8080/api/blog", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.message == "success") {
          getNews();
        }
      })
      .catch((error) => console.log("error", error));
  }

  async function getNews() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", window.localStorage.getItem("token"));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch("http://localhost:8080/api/blog", requestOptions)
      .then((response) => {
        if (response.status == 401) {
          router.push("/");
        } else {
          return response.json();
        }
      })
      .then((result) => setNews(result.data))
      .catch((error) => console.log("errorsdfsdfsdf", error));
  }

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const tokenExpTime = window.localStorage.getItem("tokenExpTime");

    if (!token || moment().isAfter(moment(tokenExpTime))) {
      setProfile("Log in");
      console.log("TOKEN EXPIRED!!!!!!!");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("tokenExpTime");
      router.push("/");
    } else {
      setProfile("Admin");
    }
    console.log("Token: ", token, tokenExpTime);

    getNews();
  }, []);

  return (
    <>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <Popover>
              <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav
                  className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                  aria-label="Global"
                >
                  <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                    <div className="flex items-center justify-between w-full md:w-auto">
                      <a href="#">
                        <span className="sr-only">Workflow</span>
                        <img
                          className="h-8 w-auto sm:h-10"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        />
                      </a>
                      <div className="-mr-2 flex items-center md:hidden">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Open main menu</span>
                          <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="font-medium text-gray-500 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    ))}
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {profile}
                    </a>
                  </div>
                </nav>
              </div>

              <Transition
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel
                  focus
                  className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                >
                  <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="px-5 pt-4 flex items-center justify-between">
                      <div>
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                          alt=""
                        />
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close main menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <a
                      href="#"
                      className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                    >
                      Log in
                    </a>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
          <main className="mt-10 mx-auto ml-4 mr-4">
            <div className="sm:text-center lg:text-left">
              <h1 className="font-bold text-3xl">Blog post</h1>
              <div className="flex flex-col">
                <input
                  type="text"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="mt-6"
                />

                <textarea
                  defaultValue={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="
                    mt-4
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="Your message"
                ></textarea>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  placeholder=""
                  defaultValue={image}
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-6"
                />
                <button
                  onClick={() => postNews()}
                  className="bg-indigo-600 text-white pt-2 pb-2 w-32 rounded mt-6"
                >
                  post
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-12">
              {news.map((x) => (
                <div className="bg-white shadow-lg w-full p-5">
                  <h2 className="font-bold text-3xl">{x.title}</h2>
                  <p>{x.message}</p>
                  <p>{x.date}</p>
                  <img src={x.image} alt={x.title} className="object-cover" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
