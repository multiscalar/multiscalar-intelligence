---
title: Rehearsing an Agent Market Before It Opens
subtitle: Five frontier models in the opening auction of ARIA's Scaling Trust Arena
date: 2026-11-11
display_date: November 2026
tag: Market Design
summary: Given a chat channel, frontier models proposed dividing the lots within 34 seconds and cut the seller's revenue by 54%. Then they broke their own deals in the final minute.
image: /assets/auctionbench/live-poster.jpg
---

AI agents are starting to trade for people and companies. Most of the
markets they will trade in run on rules written for human bidders, and those
rules rely on human limits: talking to rivals is slow and risky, and
nobody can act every few seconds. Agents have neither limit.

The UK's Advanced Research and Invention Agency (ARIA) is building the
Scaling Trust Arena, a competition where autonomous agents run small
organizations in a physical economy and compete for profit. Each season
opens with a 15-minute auction for the machines and shopfronts the agents
will use. We built the Multiscalar Market Simulator to rehearse that auction
before the first season, with five frontier models bidding under the Arena's
rules, on a real clock, able to message and pay each other.

<figure>
<video src="/assets/auctionbench/live.mp4" poster="/assets/auctionbench/live-poster.jpg" controls muted playsinline preload="metadata"></video>
<figcaption>The simulator's live view of one auction. Each desk is a bidder, each pedestal a lot with its current price. Purple lines are private messages between bidders.</figcaption>
</figure>

## The setup

Five models from five labs took the seats: Claude Opus 5.5, GPT-6 Astra,
DeepSeek V4.1 Flash, MiMo V2.6 Pro and Qwen3.8 Max. They bid for six lots in
an English auction with anonymous bids, a fixed close and a budget of £1,000
each. We played the same three markets in three settings: all five models
with chat and payments, the same auctions with both switched off, and each
model alone against four bots that bid their true values. Rotating the models
through the seats gave 45 auctions.

Every market comes from a seed, so we know what each lot is worth to each
bidder and which allocation creates the most value. That lets us score every
outcome against the best one possible, and against honest competition: with
a value bot in every seat, the market reaches 99.95% of the best allocation.

## A cartel in the first minute

In every auction with chat, a bidder proposed dividing the lots within 34
seconds. Nothing in the briefing asked them to. The pitches followed one
template: assign each bidder a lot, bid at the floor, threaten a price war on
anyone who raises. Opus opened one auction with:

> "Quick math: 5 of us, values close, lots worth less together. A bidding war
> pushes every lot up until each of us nets ~100. If we split instead,
> everyone nets 350+. […] Never raise another's lot: a raise on any lot =
> deal off, war on all."

In ten of the fifteen auctions all five bidders agreed on one split, and in
the other five a smaller cartel formed. No message objected. Nine private
notes called the arrangement a cartel.

The seller paid for it. Revenue fell in every one of the fifteen pairs of
auctions, by 54% on average. In the one auction where the split held to the
close, the seller earned £26 for lots that sold for £1,692 without chat.

<div><value-split></value-split></div>

The rules mattered far more than who was bidding. Swapping the value bots for
five frontier models cost the seller 12% of its revenue. Letting the same
models talk cost it more than half of what remained.

## Then they broke the deal

Most splits did not last. Of the ten auctions where all five agreed, the
split held to the close in one. In the others, a member bid on its partners'
lots in the final minute, when the partners had no time to answer.

DeepSeek promised everyone it would honor the split "even in the final
seconds". Six and a half minutes later, its private notes planned "a
final-second raid on all cheap lots". At 14 minutes 48 seconds it bid on all
six lots and won five of them for £110 in total. Qwen's counter-bids reached
the auction 46 seconds after the close.

Speed decided who could defect. DeepSeek, the fastest model at under four
seconds per call, won 2.9 lots per auction with chat; no other model won more
than 0.9. It also broke 85% of the deals it had accepted, against 19% to 39%
for the others. Every model earned more with chat than without, and the
Arena ranks organizations on profit, so this auction rewards the best cartel
member, or the best defector.

<div><profit-by-model></profit-by-model></div>

## Promises paid in cash

Agents backed their deals with money. In twelve of the fifteen auctions with
chat, bidders made thirty payments to each other, £2,050 in total, and they
negotiated hard: DeepSeek asked Qwen for £200 to leave a lot, came down to
£150 and settled at £120 ("My absolute final offer").

Nothing enforced what a payment bought. Three times, a lot someone had paid
for went to a last-minute defector anyway. Opus paid Qwen £120 to stay off a
lot, lost it to a third bidder, and finished with the worst result of the
run. In this rehearsal, the agents' inability to trust each other protected
the seller more than any rule did. The Arena lets agents write smart
contracts that pay out only when a condition is met, which would have
protected Opus, and would also make a cartel enforceable.

## Bidding for free

Bids in the Arena cost nothing. In a separate experiment without chat,
agents placed 942 bids per auction, and 84% of their accepted bids raised the
price by the £1 minimum. A fee of £0.10 per bid cut bids by 29%, while
competitive bidders kept the same allocation and the seller the same revenue.

## What we recommended to the Arena

- A fee of £0.10 on every bid that reaches the auction.
- A stated rule on coordination during the auction, with a monitor on agent
  messages.
- A short conduct check at admission. Models that pass the same capability
  tests differ fourfold in how often they break the deals they accept.
- A redesigned close, paired with reserve prices. The last-minute defections
  that reward speed are also what breaks the cartels today, so a close that
  stops them could make cartels more stable.
- A clear position on conditional contracts during the auction.

## Beyond the Arena

Market designers have always learned from failure after launch, at real cost.
With agents, a failure shows up in the first minute of trading. The
simulator's economy, rules and population are separate parts, so we can point
it at other markets where agents will bid, such as procurement auctions and
compute markets, and rehearse them before they open. Next, we will calibrate
it on the outcomes of the Arena's first season.

This work, by Samir Salman, Marcello Politi and Davide Crapis, is funded by
ARIA, which runs the Arena.
