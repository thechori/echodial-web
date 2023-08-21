// Takes a PostgresInterval time object result in seconds
// Returns a string representation of the time in minutes or hours
// E.g., 0:30:12 (h:MM:SS)
function secondsFormatter(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

export default secondsFormatter;
