
import React from 'react';

export const COLORS = {
  primary: '#1d9bf0',
  border: '#2f3336',
  background: '#000000',
  secondaryText: '#71767b',
  hover: '#181818',
};

export const Icons = {
  X: () => (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Home: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? 'fill-white' : 'stroke-white fill-none'}`} strokeWidth={active ? 0 : 1.5}>
      <path d="M21 21H3V8L12 3L21 8V21Z" />
    </svg>
  ),
  Explore: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} stroke-white fill-none`}>
      <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Notifications: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? 'fill-white' : 'stroke-white fill-none'}`} strokeWidth={active ? 0 : 1.5}>
      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
      <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" />
    </svg>
  ),
  Messages: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? 'fill-white' : 'stroke-white fill-none'}`} strokeWidth={active ? 0 : 1.5}>
      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Profile: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-7 w-7 ${active ? 'fill-white' : 'stroke-white fill-none'}`} strokeWidth={active ? 0 : 1.5}>
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  More: () => (
    <svg viewBox="0 0 24 24" className="h-7 w-7 stroke-white fill-none" strokeWidth={1.5}>
      <path d="M12 12M12 5M12 19" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1" fill="white" />
      <circle cx="12" cy="5" r="1" fill="white" />
      <circle cx="12" cy="19" r="1" fill="white" />
    </svg>
  ),
  Like: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? 'fill-rose-500' : 'stroke-current fill-none'}`} strokeWidth={active ? 0 : 1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Retweet: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? 'stroke-green-500' : 'stroke-current'} fill-none`} strokeWidth={2}>
      <path d="M17 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 23l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Reply: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current fill-none" strokeWidth={1.5}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Share: ({ active }: { active?: boolean }) => (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${active ? 'stroke-[#1d9bf0]' : 'stroke-current'} fill-none`} strokeWidth={1.5}>
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6l-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Media: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
    </svg>
  ),
  ImageGen: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
  VideoGen: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M19 7h-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM5 15V5h10v2H9c-1.1 0-2 .9-2 2v6H5zm14 4H9V9h10v10zM15 11l-3 4h6l-3-4z" />
    </svg>
  ),
  Audio: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Volume: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
  Mute: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  ),
  Gif: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13zM11 10.5h1V14h-1v-3.5zm-2 2.5v.5c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1h2v1H8v1h1zm4-3h2v1h-1v1h1v1h-2v-3z" />
    </svg>
  ),
  Poll: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM15 15.5h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5zm1-3.5h-8c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h8c.276 0 .5.224.5.5s-.224.5-.5.5zm-1-3.5h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z" />
    </svg>
  ),
  Emoji: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 18c-4.549 0-8.25-3.701-8.25-8.25S7.451 3.75 12 3.75s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25zM8.5 11c.828 0 1.5-.672 1.5-1.5S9.328 8 8.5 8 7 8.672 7 9.5s.672 1.5 1.5 1.5zm7 0c.828 0 1.5-.672 1.5-1.5S16.328 8 15.5 8 14 8.672 14 9.5s.672 1.5 1.5 1.5zm-10.5 3c0 3.038 2.462 5.5 5.5 5.5s5.5-2.462 5.5-5.5H5z" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0]">
      <path d="M7 4V3h2v1h6V3h2v1h1.5C19.881 4 21 5.119 21 6.5v12c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-12C3 5.119 4.119 4 5.5 4H7zM5.5 6c-.276 0-.5.224-.5.5v12c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-12c0-.276-.224-.5-.5-.5h-13zM16 10H8v5h8v-5z" />
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1d9bf0] opacity-50">
      <path d="M12 2.25c-4.142 0-7.5 3.358-7.5 7.5 0 1.636.527 3.151 1.424 4.382l5.576 7.424c.124.166.319.264.526.264s.402-.098.526-.264l5.576-7.424c.897-1.231 1.424-2.746 1.424-4.382 0-4.142-3.358-7.5-7.5-7.5zm0 10.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
    </svg>
  ),
  Views: () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current fill-none" strokeWidth={1.5}>
      <path d="M3 12c0 0 4-8 9-8s9 8 9 8-4 8-9 8-9-8-9-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
