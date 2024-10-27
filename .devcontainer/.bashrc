HISTSIZE=10000
HISTFILESIZE=20000

GIT_PS1_SHOWDIRTYSTATE=true
GIT_PS1_SHOWSTASHSTATE=true
GIT_PS1_SHOWUNTRACKEDFILES=true
GIT_PS1_SHOWCOLORHINTS=true
GIT_PS1_SHOWUPSTREAM="auto"
source /usr/lib/git-core/git-sh-prompt
PS1='\e[1;33m\w\e[1;36m$(__git_ps1 "(%s)")\e[0m
\$ '

alias ls='ls --color=auto --group-directories-first -F'
