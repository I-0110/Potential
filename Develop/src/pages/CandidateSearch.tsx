import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [searchQuery, setSearchQuery] = useState(' ');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await searchGithubUser();
        setCandidate(data);
      } catch (err) {
        setErr('Failed to fetch candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, []);  

const handleSearch = async () => {
  setLoading(true);
  setErr(null);
  try {
    const data = await searchGithub(searchQuery);
    setCandidates(data);
    setCandidate(data[0]);
  } catch (err) {
    setErr('Failed to fetch candidates');
  } finally {
    setLoading(false);
  }
};

const saveCandidate = () => {
  if (candidate) {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates')) || [];
    savedCandidates.push(candidate);
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));

    skipCandidate();
  }
};

const skipCandidate = async () => {
  try {
    const data= await searchGithubUser();
    setCandidate(data);
  } catch (err) {
    setErr('Failed to fetch new candidate');
  }
};

if (loading) {
  return <p>Loading...</p>;
}

if (err) {
  return <p>{err}</p>;
}

return(
  <div>
    <h1>CandidateSearch</h1>
    <input 
      type='text'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder='Search for a candidate' />
      <button onClick={handleSearch}>Search</button>
    {candidates.length > 0 && ( 
    <div>
      {candidates.map((candidate, index) => (
        <div key={index}>
          <h2>{candidate.name}</h2>
          <p>{candidate.username}</p>
          <p>{candidate.location}</p>
          <img src={candidate.avatar_url} alt={candidate.name} />
          <button onClick={saveCandidate}>+</button>
          <button onClick={skipCandidate}>-</button>
        </div>
      ))}
      </div>
      )}
  </div>
)};

export default CandidateSearch;
