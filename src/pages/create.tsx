import { Web3Button } from "@thirdweb-dev/react";
import React, { useState } from "react";
import useCreatePost from "../lib/useCreatePost";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import { create } from "domain";

export default function Create() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { mutateAsync: createPost } = useCreatePost();

  console.log({ image, title, description, content });

  return (
    <div>
      {/* Input for the image */}
      <div>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
        ></input>
      </div>

      {/* Input for the title */}
      <div>
        <input
          className="text-black"
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          className="text-black"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Content */}
        <div>
          <textarea
            className="text-black"
            placeholder="Content"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Web3Button
          contractAddress={LENS_CONTRACT_ADDRESS}
          contractAbi={LENS_CONTRACT_ABI}
          action={async () => {
            if (!image) return;
            return await createPost({
              image,
              title,
              description,
              content,
            });
          }}
        >
          Create Post
        </Web3Button>
      </div>
    </div>
  );
}
