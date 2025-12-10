import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "20s", target: 100 },
    { duration: "30s", target: 100 },
    { duration: "10s", target: 200 },
    { duration: "20s", target: 0 },
  ],
};

const BASE_URL = "http://localhost:7200/api";

export default function () {
  const email = `user_${__VU}_${__ITER}@example.com`;
  const password = "password123";

  // REGISTER
  const registerRes = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(registerRes, {
    "register 200 or 409": (r) => r.status === 201 || r.status === 409,
  });

  // LOGIN
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { "Content-Type": "application/json" } }
  );

  check(loginRes, {
    "login 200": (r) => r.status === 200,
  });

  const accessToken = loginRes.json("accessToken");
  const refreshToken = loginRes.json("refreshToken");

  // REFRESH
//   const refreshRes = http.post(
//     `${BASE_URL}/auth/refresh`,
//     "{}",
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `refresh_token=${refreshToken}`,
//       },
//     }
//   );

//   check(refreshRes, {
//     "refresh 200": (r) => r.status === 200,
//   });

//   // DASHBOARD
//   const dashboardRes = http.get(`${BASE_URL}/auth/me`, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });

//   check(dashboardRes, {
//     "dashboard 200": (r) => r.status === 200,
//   });

  sleep(1);
}
