import { AUTH_TOKEN, LINKS_PER_PAGE } from "../constants";
import { gql, useMutation } from "@apollo/client";
import { FEED_QUERY } from "./LinkList";

const VOTE_MUTATION = gql`
  mutation VOTE_MUTATION($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      user {
        id
      }
    }
  }
`;

const Link = ({ link, index }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: { linkId: link.id },
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery({ query: FEED_QUERY });
      const updatedLinks = feed.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });
      cache.writeQuery({ query: FEED_QUERY, data: { feed: updatedLinks } });
    },
  });

  const take = LINKS_PER_PAGE;
  const skip = 0;

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: "pointer" }}
            onClick={vote}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {authToken && (
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{" "}
            {link.postedBy ? link.postedBy.name : "Unknown"}{" "}
            {/* {timeDifferenceForDate(link.createdAt)} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;
